require('dotenv').config();
const { URL, URLSearchParams } = require('url');
const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Environment
 */
const YOUTUBE_CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID;
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const GOOGLE_API_MAX_RESULTS = 50;

const CACHE_PATH = path.resolve('src', 'cache');

/**
 * Request service
 */
class RequestService {
    _get(url, search = {}) {
        console.log(`GET - ${url}`);

        const requestUrl = new URL(url);
        requestUrl.search = new URLSearchParams(search).toString();

        return new Promise((resolve, reject) => {
            https.get(requestUrl.toString(), resp => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    resolve(JSON.parse(data));
                });
            }).on('error', reject);
        });
    }

    _search(type, pageToken) {
        return this._get(
            `${YOUTUBE_API_URL}/search`,
            {
                key: YOUTUBE_API_KEY,
                channelId: YOUTUBE_CHANNEL_ID,
                maxResults: GOOGLE_API_MAX_RESULTS,
                type,
                ...(pageToken ? { pageToken } : {}),
            },
        );
    }

    searchVideos(pageToken) {
        return this._search('video', pageToken);
    }

    getVideoData(ids) {
        return this._get(
            `${YOUTUBE_API_URL}/videos`,
            {
                key: YOUTUBE_API_KEY,
                id: ids,
                part: [ 'snippet', 'statistics' ],
            },
        );
    }

    searchPlaylists(pageToken) {
        return this._search('playlist', pageToken);
    }

    getPlaylistData(id) {
        return this._get(
            `${YOUTUBE_API_URL}/playlists`,
            {
                key: YOUTUBE_API_KEY,
                id,
                part: [ 'snippet', 'status' ],
            },
        );
    }

    getPlaylistItems(playlistId, pageToken) {
        return this._get(
            `${YOUTUBE_API_URL}/playlistItems`,
            {
                key: YOUTUBE_API_KEY,
                maxResults: GOOGLE_API_MAX_RESULTS,
                part: 'snippet',
                playlistId,
                ...(pageToken ? { pageToken } : {}),
            },
        );
    }
}

const requestService = new RequestService();

/**
 * Simulate stale cache
 */
async function onStaleCache() {
    const videoResourceKey = 'video';
    const playlistResourceKey = 'playlist';

    const videoCache = await refreshInvalidCache(videoResourceKey);
    const playlistCache = await refreshInvalidCache(playlistResourceKey);

    await writeToStorage(videoCache, videoResourceKey);
    await writeToStorage(playlistCache, playlistResourceKey);
}

onStaleCache()
    .then(() => console.log('successfully updated cache'))
    .catch(console.error);

async function writeToStorage(data, name) {
    const file = JSON.stringify(data, null, 4);
    const filePath = path.join(CACHE_PATH, `${name}.json`);

    return new Promise((resolve, reject) => {
        fs.mkdir(CACHE_PATH, { recursive: true }, () => {
            fs.writeFile(filePath, file, (err) => {
                if (err !== null) {
                    reject(err);
                }
                resolve();
            });
        });
    });
}

/**
 * Refresh invalid cache
 */
async function refreshInvalidCache(resource) {
    switch (resource) {
        case 'video': {
            const videos = await assembleVideoData();
            if (videos === null) {
                throw new Error('received no video data');
            }
            return {
                updatedAt: Date.now(),
                videos,
            };
        }
        case 'playlist': {
            const playlists = await assemblePlaylistData();
            if (playlists === null) {
                throw new Error('received no playlist data');
            }
            return {
                updatedAt: Date.now(),
                playlists,
            };
        }
        default:
            return 'unknown resource type';
    }
}

/**
 * Assemble video data
 */
async function assembleVideoData() {
    const searchItems = await iterateVideoSearch();
    if (!Array.isArray(searchItems)) {
        return null;
    }
    return searchItems;
}

async function iterateVideoSearch(pageToken, prevItems = []) {
    const searchResult = await requestService.searchVideos(pageToken);
    if (!Array.isArray(searchResult.items)) {
        return null;
    }
    const maxItemsResultLength = searchResult.pageInfo?.totalResults;
    const nextPageToken = searchResult.nextPageToken;

    const videoIds = searchResult.items.map(item => item?.id?.videoId);
    const videoDataResult = await requestService.getVideoData(videoIds);
    if (!Array.isArray(videoDataResult.items)) {
        return null;
    }
    const currentItems = videoDataResult.items.map(parseVideo);

    const itemsResult = [ ...prevItems, ...currentItems ];

    if (itemsResult.length >= maxItemsResultLength) {
        return itemsResult;
    }
    return iterateVideoSearch(nextPageToken, itemsResult);
}

function parseVideo(video) {
    return {
        id: video?.id,
        statistics: video?.statistics,
        title: video?.snippet?.title,
        description: video?.snippet?.description,
        thumbnails: video?.snippet?.thumbnails,
        publishedAt: video?.snippet?.publishedAt,
        tags: video?.snippet?.tags,
    };
}

/**
 * Assemble playlist data
 */
async function assemblePlaylistData() {
    const searchItems = await iteratePlaylistSearch();
    if (!Array.isArray(searchItems)) {
        return null;
    }
    return searchItems;
}

async function iteratePlaylistSearch(pageToken, prevPlaylists = []) {
    const searchResult = await requestService.searchPlaylists(pageToken);
    if (!Array.isArray(searchResult.items)) {
        return null;
    }
    const maxItemsResultLength = searchResult.pageInfo?.totalResults;
    const nextPageToken = searchResult.nextPageToken;

    const playlistIds = searchResult.items.map(item => item?.id?.playlistId);
    const currentPlaylists = await iteratePlaylists(playlistIds);

    const playlistsResult = [ ...prevPlaylists, ...currentPlaylists ];

    if (playlistsResult.length >= maxItemsResultLength) {
        return playlistsResult;
    }
    return iteratePlaylistSearch(nextPageToken, playlistsResult);
}

async function iteratePlaylists(playlistIds, prevPlaylists = []) {
    const currentPlaylistId = playlistIds.shift();
    const playlistResult = await requestService.getPlaylistData(currentPlaylistId);
    if (!Array.isArray(playlistResult.items)) {
        return null;
    }
    const videoIds = await iteratePlaylistItems(currentPlaylistId);
    if (videoIds === null) {
        return null;
    }
    const currentPlaylist = {
        ...parsePlaylist(playlistResult.items[0]),
        videoIds,
    };
    const playlistsResult = [ ...prevPlaylists, currentPlaylist ];
    if (playlistIds.length === 0) {
        return playlistsResult;
    }
    return iteratePlaylists(playlistIds, playlistsResult);
}

function parsePlaylist(playlist) {
    return {
        id: playlist?.id,
        title: playlist?.snippet?.title,
        description: playlist?.snippet?.description,
        thumbnails: playlist?.snippet?.thumbnails,
        publishedAt: playlist?.snippet?.publishedAt,
        isPrivate: playlist?.status?.privacyStatus !== 'public',
    };
}

async function iteratePlaylistItems(playlistId, pageToken, prevItems = []) {
    const playlistItemsResult = await requestService.getPlaylistItems(playlistId, pageToken);
    if (!Array.isArray(playlistItemsResult.items)) {
        return null;
    }
    const maxItemsResultLength = playlistItemsResult.pageInfo?.totalResults;
    const nextPageToken = playlistItemsResult.nextPageToken;

    const currentItems = playlistItemsResult.items.map(parsePlaylistItem);

    const itemsResult = [ ...prevItems, ...currentItems ];

    if (itemsResult.length >= maxItemsResultLength) {
        return itemsResult;
    }
    return iteratePlaylistItems(playlistId, nextPageToken, itemsResult);
}

function parsePlaylistItem(playlistItem) {
    return playlistItem?.snippet?.resourceId?.videoId;
}

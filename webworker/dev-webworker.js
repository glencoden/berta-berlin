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
const CACHE_FILE_NAME = 'videos.json';

/**
 * Request service
 */
class RequestService {
    _get(url, search = {}) {
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

    searchVideos(pageToken) {
        return this._get(
            `${YOUTUBE_API_URL}/search`,
            {
                key: YOUTUBE_API_KEY,
                channelId: YOUTUBE_CHANNEL_ID,
                maxResults: GOOGLE_API_MAX_RESULTS,
                ...(pageToken ? { pageToken } : {}),
                type: 'video'
            }
        );
    }

    getVideoData(ids) {
        return this._get(
            `${YOUTUBE_API_URL}/videos`,
            {
                key: YOUTUBE_API_KEY,
                id: ids,
                part: [ 'snippet', 'statistics' ]
            }
        );
    }
}

const requestService = new RequestService();

/**
 * Refresh invalid cache
 */
async function refreshInvalidCache() {
    const videoData = await assembleVideoData(YOUTUBE_CHANNEL_ID);
    if (videoData === null) {
        throw new Error('received no video data');
    }
    await updateCache(videoData);
}

refreshInvalidCache()
    .then(() => console.log('successfully cached video data'))
    .catch(console.error);

/**
 * Assemble video data
 */
async function assembleVideoData() {
    const searchItems = await iterateSearch();
    if (!Array.isArray(searchItems)) {
        return null;
    }
    return searchItems;
}

/**
 * Iterate over youtube API search pages and build video data
 */
async function iterateSearch(pageToken, prevItems = []) {
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

    const itemsResult = [...prevItems, ...currentItems];

    if (itemsResult.length >= maxItemsResultLength) {
        return itemsResult;
    }
    return iterateSearch(nextPageToken, itemsResult);
}

/**
 * Video data parser
 */
function parseVideo(video) {
    return {
        id: video?.id,
        statistics: video?.statistics,
        title: video?.snippet?.title,
        description: video?.snippet?.description,
        thumbnails: video?.snippet?.thumbnails,
        publishedAt: video?.snippet?.publishedAt,
        genres: video?.snippet?.tags, // TODO filter for genres
    };
}

/**
 * Write to storage
 */
async function updateCache(data) {
    const file = JSON.stringify(data, null, 4);
    const filePath = path.join(CACHE_PATH, CACHE_FILE_NAME);

    return new Promise((resolve, reject) => {
        fs.mkdir(CACHE_PATH, { recursive: true }, () => {
            fs.writeFile(filePath, file, (err) => {
                if (err !== null) {
                    reject(err);
                }
                resolve();
            })
        });
    });
}

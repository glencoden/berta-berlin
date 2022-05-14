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
const GOOGLE_API_MAX_RESULTS = 50;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Request service
 */

class RequestService {
    _get(url, search = {}) {
        const requestUrl = new URL(url);
        requestUrl.search = new URLSearchParams(search).toString();

        // TODO find way to get comma separated search values with .toString
        console.log('requestUrl.toString()', requestUrl.toString());

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
            `${BASE_URL}/search`,
            {
                key: YOUTUBE_API_KEY,
                channelId: YOUTUBE_CHANNEL_ID,
                maxResults: GOOGLE_API_MAX_RESULTS,
                ...(pageToken ? { pageToken } : {})
            }
        );
    }

    getVideo(ids) {
        return this._get(
            `${BASE_URL}/videos`,
            {
                key: YOUTUBE_API_KEY,
                id: ids,
                part: [ 'snippet', 'contentDetails', 'statistics' ]
            }
        );
    }
}

const requestService = new RequestService();

/**
 * Refresh invalid cache upon video data request to web worker
 */
async function onInvalidCache() {
    const videoData = await assembleVideoData(YOUTUBE_CHANNEL_ID);
    if (videoData === null) {
        throw new Error('received no video data');
    }
    await updateCache(videoData);
}

onInvalidCache()
    .then(() => console.log('successfully cached video data'))
    .catch(console.error);

/**
 * Request and build data from youtube API
 */
async function assembleVideoData() {
    // const searchResult = await iterateSearch();
    // console.log('searchResult', searchResult); // TODO map videos
    // return searchResult;

    const result = await requestService.getVideo(['oHrP7GHheks']);
    console.log('result', result);

    return {};
}

/**
 * Iterate through youtube API search pages
 */
async function iterateSearch(pageToken, prevResultList = []) {
    const currentResult = await requestService.searchVideos(pageToken);
    const maxResultListLength = currentResult.pageInfo?.totalResults;
    const nextPageToken = currentResult.nextPageToken;
    const resultList = [...prevResultList, ...currentResult.items];
    if (resultList.length >= maxResultListLength) {
        return resultList;
    }
    return iterateSearch(nextPageToken, resultList);
}

/**
 * Write to storage
 */
async function updateCache(data) {

}

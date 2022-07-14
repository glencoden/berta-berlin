/**
 * Local cache
 */
import video from '../cache/video.json';
import playlist from '../cache/playlist.json';
import channel from '../cache/channel.json';

const DEV_CACHE = {
    video,
    playlist,
    channel,
};

/**
 * Environment
 */
const CACHE_WEBWORKER_URL = 'https://api.glencoden.io/berta';
const USE_DEV_CACHE = true;

class RequestService {
    _get(url, search = {}) {
        const requestUrl = new URL(url);
        requestUrl.search = new URLSearchParams(search).toString();

        return fetch(requestUrl.toString())
            .then(response => response.json())
            .catch(console.error);
    }

    getYoutubeApiCache(resource) {
        if (process.env.NODE_ENV === 'development' && USE_DEV_CACHE) {
            return Promise.resolve(DEV_CACHE[resource]);
        }
        return this._get(CACHE_WEBWORKER_URL, { resource });
    }
}

export const requestService = new RequestService();
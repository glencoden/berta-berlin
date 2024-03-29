/**
 * Local cache
 */
import video from '../cache/video.json';
import playlist from '../cache/playlist.json';
import channel from '../cache/channel.json';
import { cacheWebworkerUrl, useLocalCache } from '../variables';

const DEV_CACHE = {
    video,
    playlist,
    channel,
};

class RequestService {
    _get(url, search = {}) {
        const requestUrl = new URL(url);
        requestUrl.search = new URLSearchParams(search).toString();

        return fetch(requestUrl.toString())
            .then(response => response.json())
            .catch(console.error);
    }

    getYoutubeApiCache(resource) {
        if (process.env.NODE_ENV === 'development' && useLocalCache) {
            return Promise.resolve(DEV_CACHE[resource]);
        }
        return this._get(cacheWebworkerUrl, { resource });
    }
}

export const requestService = new RequestService();
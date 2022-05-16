/**
 * Local cache
 */
import videoCache from '../cache/videos.json';
import channelCache from '../cache/channel.json'

/**
 * Environment
 */
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const CACHE_WEBWORKER_URL = 'https://berta.glencoden.workers.dev/';

class RequestService {
    // TODO implement URL API
    _get(url) {
        return fetch(url)
            .then(resp => resp.json())
            .catch(console.error);
    }

    getVideos() {
        return process.env.NODE_ENV === 'development'
            ? Promise.resolve(videoCache)
            : this._get(CACHE_WEBWORKER_URL);
    }

    getChannel() {
        return Promise.resolve(channelCache);
        // return this._get(`${YOUTUBE_API_URL}/channels?id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails,brandingSettings`);
    }
}

export const requestService = new RequestService();
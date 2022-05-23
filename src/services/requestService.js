/**
 * Local cache
 */
import video from '../cache/video.json';
import playlist from '../cache/playlist.json';
import channelCache from '../cache/channel.json';

/**
 * Environment
 */
// const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
// const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const CACHE_WEBWORKER_URL = 'https://berta.glencoden.workers.dev/';

class RequestService {
    _get(url, search = {}) {
        const requestUrl = new URL(url);
        requestUrl.search = new URLSearchParams(search).toString();

        return fetch(requestUrl.toString())
            .then(response => response.json())
            .catch(console.error);
    }

    getVideos() {
        if (process.env.NODE_ENV === 'development') {
            return Promise.resolve(video);
        }
        return this._get(CACHE_WEBWORKER_URL, { resource: 'video' });
    }

    getPlaylists() {
        if (process.env.NODE_ENV === 'development') {
            return Promise.resolve(playlist);
        }
        return this._get(CACHE_WEBWORKER_URL, { resource: 'playlist' });
    }

    getChannel() {
        return Promise.resolve(channelCache);
        // return this._get(`${YOUTUBE_API_URL}/channels?id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails,brandingSettings`);
    }
}

export const requestService = new RequestService();
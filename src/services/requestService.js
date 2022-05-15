// cache
import videoCache from '../cache/videos.json';
import channelCache from '../cache/channel.json'

// env
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

class RequestService {
    _get(url) {
        return fetch(url)
            .then(resp => resp.json())
            .catch(console.error);
    }

    getVideos() {
        return process.env.NODE_ENV === 'development'
            ? Promise.resolve(videoCache)
            : this._get('https://berta.glencoden.workers.dev/'); // TODO update webworker url
    }

    getChannel() {
        return Promise.resolve(channelCache);
        // return this._get(`${YOUTUBE_API_URL}/channels?id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails,brandingSettings`);
    }

    // getPlaylists() {
    //     return this._get(`${YOUTUBE_API_URL}/playlists?channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=contentDetails,player,snippet,status`);
    // }
}

export const requestService = new RequestService();
// mocks
import searchResult from './mock-data/searchResult.json'
import channelResult from './mock-data/channelResult.json'
import videoResult from './mock-data/videoResult.json'

// env
const YOUTUBE_CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID;
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

class RequestService {
    _get(url) {
        return fetch(url)
            .then(resp => resp.json())
            .catch(console.error);
    }

    getAll() {
        return Promise.resolve(searchResult);
        // return this._get(`${BASE_URL}/search?channelId=${YOUTUBE_CHANNEL_ID}&maxResults=12&key=${YOUTUBE_API_KEY}`);
    }

    getVideo(id) {
        return Promise.resolve(videoResult);
        // return this._get(`${BASE_URL}/videos?id=${id}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails,statistics,player`);
    }

    getChannel() {
        return Promise.resolve(channelResult);
        // return this._get(`${BASE_URL}/channels?id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails,brandingSettings`);
    }

    getPlaylists() {
        return this._get(`${BASE_URL}/playlists?channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=contentDetails,player,snippet,status`);
    }
}

export const requestService = new RequestService();
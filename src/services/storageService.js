import { editorService } from './editorService';
import { getVideoGenres } from '../context/helpers/getVideoGenres';

const StorageKeys = {
    WATCHED_VIDEOS: 'BERTA.WATCHED_VIDEOS',
    RECENT_GENRES: 'BERTA.RECENT_GENRES',
};

const MIN_NUM_UNSEEN_VIDEOS = 50;
const GENRE_LIST_STALE_TIME = 1000 * 60 * 60 * 24;

class StorageService {
    _get(key) {
        return this._parse(localStorage.getItem(key));
    }

    _set(key, value) {
        return localStorage.setItem(key, this._stringify(value));
    }

    _stringify(value) {
        return JSON.stringify(value);
    }

    _parse(value) {
        if (value === null) {
            return null;
        }
        let result = null;
        try {
            result = JSON.parse(value);
        } catch (err) {
            console.error(err);
        }
        return result;
    }

    getSeenVideoIds() {
        return this._get(StorageKeys.WATCHED_VIDEOS);
    }

    setSeenVideoIds(video) {
        const maxNumStoredIds = editorService.getNumVideos() - MIN_NUM_UNSEEN_VIDEOS;
        const currentSeenVideoIds = this.getSeenVideoIds();
        const storageUpdate = [ video.id, ...(currentSeenVideoIds === null ? [] : currentSeenVideoIds) ].slice(0, maxNumStoredIds);
        this._set(StorageKeys.WATCHED_VIDEOS, storageUpdate);
    }

    getRecentlyWatchedGenres() {
        const storageValue = this._get(StorageKeys.RECENT_GENRES);
        if (storageValue === null) {
            return null;
        }
        return storageValue.genreList;
    }

    setRecentlyWatchedGenres(video) {
        if (!Array.isArray(video.tags)) {
            return;
        }
        const inputGenreList = getVideoGenres(video);
        const currentStorage = this.getRecentlyWatchedGenres();
        const currentTimestamp = Date.now();
        if (currentStorage === null || (currentStorage.updatedAt + GENRE_LIST_STALE_TIME) < currentTimestamp) {
            const storageUpdate = {
                updatedAt: currentTimestamp,
                genreList: inputGenreList,
            };
            this._set(StorageKeys.RECENT_GENRES, storageUpdate);
            return;
        }
        const genreListUpdate = [ ...currentStorage ];
        inputGenreList.forEach((genre) => {
            if (!genreListUpdate.includes(genre)) {
                genreListUpdate.push(genre);
            }
        });
        const storageUpdate = {
            updatedAt: currentTimestamp,
            genreList: genreListUpdate,
        };
        this._set(StorageKeys.RECENT_GENRES, storageUpdate);
    }
}

export const storageService = new StorageService();
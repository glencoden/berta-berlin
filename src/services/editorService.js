import { ResourceType } from '../enums/ResourceType';
import { playlistFilterKey } from '../styles/variables';
import { FilterType } from '../enums/FilterType';
import { storageService } from './storageService';
import { getVideoGenres } from '../context/helpers/getVideoGenres';

// function getRandomVideos(videos) {
//     const dupe = [ ...videos ];
//     const result = [];
//     for (let i = 0; i < Math.min(dupe.length, 10); i++) {
//         const randomIndex = Math.floor(Math.random() * dupe.length);
//         const randomItem = { ...dupe[randomIndex] };
//         dupe.splice(randomIndex, 1);
//         result.push(randomItem);
//     }
//     return result;
// }

const MAX_VIDEO_LIST_LENGTH = 10;
const GENRE_QUOTA_PERCENTAGE = 20;

class EditorService {
    playlists = null;
    videos = null;
    videosByTrend = null;
    videosByCreatedAt = null;

    setPlaylists(playlists) {
        this.playlists = playlists.filter(playlist => playlist.description.includes(playlistFilterKey));
    }

    setVideos(videos) {
        this.videos = videos;

        let genres = [];
        this.videos.forEach(video => {
            genres = [ ...genres, ...getVideoGenres(video) ];
        });
        console.log('genres', genres); // TODO remove dev code

        this.videosByTrend = videos.sort((a, b) => b.statistics.viewCount * b.statistics.likeCount - a.statistics.viewCount * a.statistics.likeCount);
        this.videosByCreatedAt = videos.sort((a, b) => new Date(b.publishedAt) > new Date(a.publishedAt) ? 1 : -1);
    }

    getPlaylists() {
        return this.playlists;
    }

    getNumVideos() {
        if (this.videos === null) {
            return 0;
        }
        return this.videos.length;
    }

    getVideos({ filterType, resourceType, selectedPlaylistId }) {
        const selectedVideoList = this._selectVideoList(filterType);
        if (selectedVideoList === null) {
            console.warn('no videos', filterType);
            return;
        }
        switch (resourceType) {
            case ResourceType.VIDEO: {
                return this._makeResultVideoList(selectedVideoList);
            }
            case ResourceType.PLAYLIST: {
                if (this.playlists === null) {
                    console.warn('no playlists');
                    return;
                }
                const videosForPlaylist = this._getVideosForCurrentPlaylist(selectedPlaylistId, selectedVideoList);
                return this._makeResultVideoList(videosForPlaylist);
            }
            default:
                console.warn('unknown resource type');
        }
    }

    _selectVideoList(filterType) {
        switch (filterType) {
            case FilterType.TRENDING:
                return this.videosByTrend;
            case FilterType.RECENT:
                return this.videosByCreatedAt;
            default:
                return this.videosByTrend;
        }
    }

    _makeResultVideoList(selectedVideoList) {
        const filteredVideoList = this._filterVideoListForUnseen(selectedVideoList);

        const numQuotaResults = Math.min(
            Math.floor(GENRE_QUOTA_PERCENTAGE / MAX_VIDEO_LIST_LENGTH),
            Math.floor(filteredVideoList.length * GENRE_QUOTA_PERCENTAGE / 100),
        );
        const quotaVideoList = this._fillVideoListGenreQuota(filteredVideoList, numQuotaResults);

        return quotaVideoList.slice(0, MAX_VIDEO_LIST_LENGTH);
    }

    _filterVideoListForUnseen(videoList) {
        const seenVideoIds = storageService.getSeenVideoIds();

        if (seenVideoIds === null) {
            return videoList;
        }
        return videoList.filter((video) => !seenVideoIds.includes(video.id));
    }

    _fillVideoListGenreQuota(videoList, numResults) {
        const recentlyWatchedGenres = storageService.getRecentlyWatchedGenres();

        if (recentlyWatchedGenres === null) {
            return videoList;
        }
        const currentVideoList = [ ...videoList ];
        const resultList = [];
        let currentVideoIndex = 0;
        while (resultList.length < numResults && currentVideoIndex < currentVideoList.length) {
            const currentVideo = currentVideoList[currentVideoIndex];
            currentVideoIndex++;
            if (
                Array.isArray(currentVideo.tags)
                && getVideoGenres(currentVideo).some((tag) => recentlyWatchedGenres.includes(tag))
            ) {
                const splice = currentVideoList.splice(currentVideoIndex, 1);
                resultList.push(splice[0]);
            }
        }
        return [
            ...resultList,
            ...currentVideoList,
        ];
    }

    _getVideosForCurrentPlaylist(playlistId, videos) {
        const currentPlaylist = this.playlists?.find(playlist => playlist.id === playlistId);
        if (!currentPlaylist) {
            console.warn('playlist not found');
            return;
        }
        return currentPlaylist.videoIds
            .map(videoId => videos.find(video => video.id === videoId))
            .filter(Boolean);
    }
}

export const editorService = new EditorService();
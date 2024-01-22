import { ResourceType } from '../enums/ResourceType';
import { genreQuotaPercentage, maxVideoListLength, playlistFilterKey } from '../variables';
import { FilterType } from '../enums/FilterType';
import { storageService } from './storageService';
import { getVideoGenres } from '../context/helpers/getVideoGenres';

const sortPopular = (videos) => {
    return videos.toSorted((a, b) => b.statistics.popularity - a.statistics.popularity);
};

const sortTrending = (videos) => {
    const videosByTrend = videos.toSorted((a, b) => b.statistics.trend - a.statistics.trend);
    const videosByGain = videosByTrend.toSorted((a, b) => b.statistics.gain - a.statistics.gain);

    const rankByVideoId = {};

    videosByTrend.forEach((video, index) => {
        rankByVideoId[video.id] = index;
    });

    videosByGain.forEach((video, index) => {
        rankByVideoId[video.id] += index;
    });

    return videos.toSorted((a, b) => rankByVideoId[a.id] - rankByVideoId[b.id]);
};

const sortRecent = (videos) => {
    return videos.toSorted((a, b) => new Date(b.publishedAt) > new Date(a.publishedAt) ? 1 : -1);
};

class EditorService {
    playlists = null;
    videos = null;
    externalVideos = null;
    videosByPopularity = null;
    videosByTrend = null;
    videosByCreatedAt = null;
    numProvidedVideoLists = 0;
    insertVideo = null;

    setPlaylists(playlists) {
        this.playlists = playlists.filter(playlist => playlist.description.includes(playlistFilterKey));
    }

    setVideos(videos) {
        this.videos = [];

        videos.forEach((video) => {
            if (!this.videos.find(v => v.id === video.id)) {
                this.videos.push(video);
            }
        });

        if (process.env.NODE_ENV === 'development') {
            console.log('==== INPUT VS DUPE FILTERED LENGTH ====', videos.length, this.videos.length);
            let genres = [];
            this.videos.forEach(video => {
                genres = [ ...genres, ...getVideoGenres(video) ];
            });
            console.log('==== GENRES ====', genres);
        }

        this.videosByPopularity = sortPopular(this.videos);
        this.videosByTrend = sortTrending(this.videos);
        this.videosByCreatedAt = sortRecent(this.videos);
    }

    setExternalVideos(videos) {
        this.externalVideos = [];

        videos.forEach((video) => {
            if (!this.externalVideos.find(v => v.id === video.id)) {
                this.externalVideos.push(video);
            }
        });
    }

    setInsertVideo(id) {
        const insertVideo = this.getAllVideos().find((video) => video.id === id);
        if (!insertVideo) {
            return;
        }
        this.insertVideo = insertVideo;
    }

    getPlaylists() {
        return this.playlists;
    }

    getAllVideos() {
        return this.videos;
    }

    getInsertVideo() {
        return this.insertVideo;
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
            console.warn(`no videos for filter type "${filterType}"`);
            return;
        }

        switch (resourceType) {
            case ResourceType.VIDEO: {
                const filteredList = this._filterVideoListForUnseen(selectedVideoList);
                return this._makeResultVideoList(filteredList);
            }
            case ResourceType.PLAYLIST: {
                if (this.playlists === null) {
                    console.warn('no playlists');
                    return;
                }
                const allPlaylistVideos = Array.isArray(this.externalVideos) ? [ ...selectedVideoList, ...this.externalVideos ] : selectedVideoList;
                const videosForPlaylist = this._getVideosForCurrentPlaylist(selectedPlaylistId, allPlaylistVideos);

                return this._makeResultVideoList(videosForPlaylist);
            }
            default:
                console.warn('unsupported resource type');
        }
    }

    _selectVideoList(filterType) {
        switch (filterType) {
            case FilterType.POPULAR:
                return this.videosByPopularity;
            case FilterType.TRENDING:
                return this.videosByTrend;
            case FilterType.RECENT:
                return this.videosByCreatedAt.filter((video) => !video.description?.includes('#shorts'));
            default:
                console.warn(`unknown filter type "${filterType}"`);
                return this.videosByTrend;
        }
    }

    _makeResultVideoList(videoList) {
        const numQuotaResults = Math.floor(Math.min(videoList.length, maxVideoListLength) * genreQuotaPercentage / 100);
        const resultVideoList = this._collectQuotaAndTrim(videoList, numQuotaResults);

        this.numProvidedVideoLists++;

        resultVideoList.forEach(video => video.renderKey = `${video.id}_${this.numProvidedVideoLists}`);

        return resultVideoList;
    }

    _filterVideoListForUnseen(videoList) {
        const seenVideoIds = storageService.getSeenVideoIds();

        if (seenVideoIds === null) {
            return videoList;
        }
        return videoList.filter((video) => !seenVideoIds.includes(video.id));
    }

    _collectQuotaAndTrim(videoList, numResults) {
        const recentlyWatchedGenres = storageService.getRecentlyWatchedGenres();

        if (recentlyWatchedGenres === null) {
            return videoList.slice(0, maxVideoListLength);
        }
        const currentVideoList = [ ...videoList ];
        const quotaResults = {};

        let currentVideoIndex = 0;

        while (Object.keys(quotaResults).length < numResults && currentVideoIndex < currentVideoList.length) {
            const currentVideo = currentVideoList[currentVideoIndex];
            const currentVideoGenres = getVideoGenres(currentVideo);
            if (
                currentVideoGenres.length > 0
                && currentVideoGenres.some((tag) => recentlyWatchedGenres.includes(tag))
            ) {
                const splice = currentVideoList.splice(currentVideoIndex, 1);
                quotaResults[currentVideoIndex] = splice[0];
            } else {
                currentVideoIndex++;
            }
        }
        const quotaResultKeys = Object.keys(quotaResults);
        const highestQuotaIndex = quotaResultKeys[quotaResultKeys.length - 1];
        const indexCompression = Math.min((maxVideoListLength - 1) / highestQuotaIndex, 1);

        const numNonQuotaVideos = maxVideoListLength - quotaResultKeys.length;
        const resultVideoList = currentVideoList.slice(0, numNonQuotaVideos);

        Object.entries(quotaResults).forEach(([ key, value ]) => {
            const insertionIndex = Math.floor(parseInt(key) * indexCompression);
            resultVideoList.splice(insertionIndex, 0, value);
        });

        if (process.env.NODE_ENV === 'development') {
            console.log('==== QUOTA ====', quotaResults);
            console.log('==== VIDEOS ====', resultVideoList);
        }
        return resultVideoList;
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
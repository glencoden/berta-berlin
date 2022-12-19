import { ResourceType } from '../enums/ResourceType';
import { genreQuotaPercentage, maxVideoListLength, playlistFilterKey, trendingPeriodInDays } from '../styles/variables';
import { FilterType } from '../enums/FilterType';
import { storageService } from './storageService';
import { getVideoGenres } from '../context/helpers/getVideoGenres';

const getPopFactor = (video, numDaysLimit) => {
    const overallPop = video.statistics.viewCount * video.statistics.likeCount;
    if (typeof numDaysLimit !== 'number' || numDaysLimit < 1) {
        return overallPop;
    }
    const videoAgeInDays = Math.round(
        (Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    // the older the video, the lower the popularity - this is a hack to mimic a trend
    return Math.round(overallPop * (numDaysLimit / videoAgeInDays));
};

const sortPopular = (a, b) => getPopFactor(b) - getPopFactor(a);
const sortTrending = (a, b) => getPopFactor(b, trendingPeriodInDays) - getPopFactor(a, trendingPeriodInDays);
const sortRecent = (a, b) => new Date(b.publishedAt) > new Date(a.publishedAt) ? 1 : -1;

class EditorService {
    playlists = null;
    videos = null;
    videosByPopularity = null;
    videosByTrend = null;
    videosByCreatedAt = null;
    numProvidedVideoLists = 0;

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

        // TODO remove dev code
        let genres = [];
        this.videos.forEach(video => {
            genres = [ ...genres, ...getVideoGenres(video) ];
        });
        console.log('==== GENRES ====', genres);

        this.videosByPopularity = [ ...this.videos ].sort(sortPopular);
        this.videosByTrend = [ ...this.videos ].sort(sortTrending);
        this.videosByCreatedAt = [ ...this.videos ].sort(sortRecent);
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
                const videosForPlaylist = this._getVideosForCurrentPlaylist(selectedPlaylistId, selectedVideoList);
                return this._makeResultVideoList(videosForPlaylist);
            }
            default:
                console.warn('unknown resource type');
        }
    }

    _selectVideoList(filterType) {
        switch (filterType) {
            case FilterType.POPULAR:
                return this.videosByPopularity;
            case FilterType.TRENDING:
                return this.videosByTrend;
            case FilterType.RECENT:
                return this.videosByCreatedAt;
            default:
                console.warn(`unknown filter type "${filterType}"`);
                return this.videosByTrend;
        }
    }

    _makeResultVideoList(videoList) {
        const numQuotaResults = Math.min(
            Math.floor(genreQuotaPercentage / maxVideoListLength),
            Math.floor(videoList.length * genreQuotaPercentage / 100),
        );
        const resultVideoList = this._collectVideoListGenreQuota(videoList, numQuotaResults);

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

    _collectVideoListGenreQuota(videoList, numResults) {
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
            }
            currentVideoIndex++;
        }
        const numNonQuotaVideos = maxVideoListLength - numResults;
        const resultVideoList = currentVideoList.slice(0, numNonQuotaVideos);

        Object.entries(quotaResults).forEach(([ key, value ]) => {
            resultVideoList.splice(parseInt(key), 0, value);
        });

        // TODO remove dev code
        console.log('==== QUOTA ====', quotaResults);
        console.log('==== RESULT ====', resultVideoList);

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
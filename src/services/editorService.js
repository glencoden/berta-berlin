import { ResourceType } from '../enums/ResourceType';
import { playlistFilterKey } from '../styles/variables';

function getRandomVideos(videos) {
    const dupe = [ ...videos ];
    const result = [];
    for (let i = 0; i < Math.min(dupe.length, 10); i++) {
        const randomIndex = Math.floor(Math.random() * dupe.length);
        const randomItem = { ...dupe[randomIndex] };
        dupe.splice(randomIndex, 1);
        result.push(randomItem);
    }
    return result;
}

class EditorService {
    playlists = null;
    videos = null;

    setPlaylists(playlists) {
        this.playlists = playlists.filter(playlist => playlist.description.includes(playlistFilterKey));
    }

    setVideos(videos) {
        this.videos = videos;
    }

    getPlaylists() {
        return this.playlists;
    }

    getVideos({ filterType, resourceType, selectedPlaylistId }) {
        switch (resourceType) {
            case ResourceType.VIDEO: {
                if (this.videos === null) {
                    console.warn('no videos');
                    return;
                }
                return getRandomVideos(this.videos);
            }
            case ResourceType.PLAYLIST: {
                if (this.playlists === null) {
                    console.warn('no playlists');
                    return;
                }
                const videos = this._getVideosForCurrentPlaylist(selectedPlaylistId);
                return getRandomVideos(videos);
            }
            default:
                console.warn('unknown resource type');
        }
    }

    _getVideosForCurrentPlaylist(playlistId) {
        const currentPlaylist = this.playlists?.find(playlist => playlist.id === playlistId);
        if (!currentPlaylist) {
            console.warn('playlist not found');
            return;
        }
        return currentPlaylist.videoIds
            .map(videoId => this.videos?.find(video => video.id === videoId))
            .filter(Boolean);
    }
}

export const editorService = new EditorService();
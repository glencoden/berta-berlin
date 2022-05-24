import { FilterType } from '../enums/FilterType';
import { ResourceType } from '../enums/ResourceType';
import { MenuItemType } from '../enums/MenuItemType';
import { playlistFilterKey } from '../styles/variables';

function getRandomVideos(videos) {
    const dupe = [ ...videos ];
    const result = [];
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * dupe.length);
        const randomItem = { ...dupe[randomIndex] };
        dupe.splice(randomIndex, 1);
        result.push(randomItem);
    }
    return result;
}

class EditorService {
    videos = null;
    playlists = null;
    selectedPlaylistId = null;
    filterType = FilterType.TRENDING;
    resourceType = ResourceType.VIDEO;

    // getVideos() {
    //     return this.videos;
    // }

    getPlaylists() {
        return this.playlists;
    }

    setVideos(videos) {
        this.videos = videos;
    }

    setPlaylists(playlists) {
        this.playlists = playlists.filter(playlist => playlist.description.includes(playlistFilterKey));
    }

    onMenuItemSelect(menuItem) {
        switch (menuItem.type) {
            case MenuItemType.FILTER:
                this.filterType = menuItem.value;
                this.resourceType = ResourceType.VIDEO;
                this.selectedPlaylistId = null;
                break;
            case MenuItemType.DASHBOARD:
                this.filterType = FilterType.TRENDING;
                this.resourceType = ResourceType.PLAYLIST;
                this.selectedPlaylistId = menuItem.value?.value;
                break;
            default:
                console.warn('unknown menu item type');
        }
    }

    getVideos() {
        switch (this.resourceType) {
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
                const videos = this._getVideosForCurrentPlaylist();
                return getRandomVideos(videos);
            }
            default:
                console.warn('unknown resource type');
        }
    }

    _getVideosForCurrentPlaylist() {
        if (this.selectedPlaylistId === null) {
            console.warn('no selected playlist id');
            return;
        }
        const currentPlaylist = this.playlists?.find(playlist => playlist.id === this.selectedPlaylistId);
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
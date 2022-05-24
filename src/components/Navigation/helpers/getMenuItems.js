import { FilterType } from '../../../enums/FilterType';
import { MenuItemType } from '../../../enums/MenuItemType';
import { getPlaylistSubmenuItems } from './getPlaylistSubmenuItems';
import { editorService } from '../../../services/editorService';

export const getMenuItems = () => {
    const playlists = editorService.getPlaylists();
    if (playlists === null) {
        return [];
    }
    return [
        {
            type: MenuItemType.FILTER,
            label: FilterType.TRENDING,
            value: FilterType.TRENDING,
        },
        {
            type: MenuItemType.FILTER,
            label: FilterType.RECENT,
            value: FilterType.RECENT,
        },
        {
            type: MenuItemType.DASHBOARD,
            label: 'playlists',
            value: null,
            options: getPlaylistSubmenuItems(playlists),
        },
    ];
};
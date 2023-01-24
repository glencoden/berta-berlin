import { MenuItemType } from '../../../enums/MenuItemType';
import { ResourceType } from '../../../enums/ResourceType';
import { FilterType } from '../../../enums/FilterType';

export const parseMenuItem = (menuItem) => {
    switch (menuItem.type) {
        case MenuItemType.FILTER:
            return {
                filterType: menuItem.value,
                resourceType: ResourceType.VIDEO,
                selectedPlaylistId: null,
            };
        case MenuItemType.DASHBOARD:
            return {
                filterType: FilterType.POPULAR,
                resourceType: ResourceType.PLAYLIST,
                selectedPlaylistId: menuItem.value?.value,
            };
        default:
            console.warn('unknown menu item type');
            return {};
    }
};
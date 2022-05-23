import { getMaxThumbnail } from './getMaxThumbnail';

export const mapItemToTile = (item) => {
    const thumbnail = getMaxThumbnail(item.thumbnails);
    return {
        url: thumbnail.url,
        title: item.title,
        description: item.description,
    };
};
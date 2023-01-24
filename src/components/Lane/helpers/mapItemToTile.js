import { getMaxThumbnail } from './getMaxThumbnail';

export const mapItemToTile = (item) => {
    const thumbnail = getMaxThumbnail(item?.thumbnails);
    return {
        key: item.renderKey,
        url: thumbnail.url,
        title: item.title,
    };
};
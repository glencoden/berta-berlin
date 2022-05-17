const decreasingSizeOrderKeys = [ 'maxres', 'standard', 'high', 'medium', 'default' ];

export const getMaxThumbnail = (thumbnails) => {
    for (const key of decreasingSizeOrderKeys) {
        const result = thumbnails[key];
        if (result) {
            return result;
        }
    }
};
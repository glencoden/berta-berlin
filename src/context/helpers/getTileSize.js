import { defaultTileWidth, laneLeft, mobileContentMargin } from '../../styles/variables';

export const getTileSize = () => {
    let width = Math.min((window.innerWidth - laneLeft), defaultTileWidth);
    let height = width / 16 * 9;

    const maxHeight = window.innerHeight - (2 * mobileContentMargin);

    if (height > maxHeight) {
        height = maxHeight;
        width = maxHeight / 9 * 16;
    }

    return { width, height };
}
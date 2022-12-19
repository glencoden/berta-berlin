import {
    defaultTileWidth,
    laneLeft,
    laneTileOffset,
    minNumRenderedTiles,
    mobileContentMargin,
} from '../../styles/variables'

export const getTileSize = () => {
    const marginRight = Math.max(minNumRenderedTiles - 1.5, 0) * laneTileOffset;

    let width = Math.min((window.innerWidth - laneLeft - marginRight), defaultTileWidth);
    let height = width / 16 * 9;

    const maxHeight = window.innerHeight - (2 * mobileContentMargin);

    if (height > maxHeight) {
        height = maxHeight;
        width = maxHeight / 9 * 16;
    }

    return { width, height };
}
import { defaultTileWidth, laneLeft, laneTileOffset, minNumRenderedTiles } from '../../../variables';

export const getNumRenderedTiles = (tileSize) => {
    if (tileSize < defaultTileWidth) {
        return minNumRenderedTiles;
    }
    const remainingSpace = window.innerWidth - laneLeft - defaultTileWidth;

    return Math.max(Math.ceil(remainingSpace / laneTileOffset), minNumRenderedTiles);
};
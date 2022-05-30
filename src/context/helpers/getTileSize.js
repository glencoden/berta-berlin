import { defaultTileWidth, laneLeft } from '../../styles/variables';

export const getTileSize = () => {
    const width = Math.min((window.innerWidth - laneLeft), defaultTileWidth);
    const height = width / 16 * 9;
    return { width, height };
}
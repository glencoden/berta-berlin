/**
 * release
 */
export const appVersion = '1.1.0';

/**
 * setup
 */
export const validGenres = [ 'Jazz', 'Pop', 'Rock', 'Electronic', 'HipHop', 'World' ];
export const minNumRenderedTiles = 3; // count

// editor service
export const playlistFilterKey = 'berta.berlin';
export const maxVideoListLength = 100; // count
export const trendingPeriodInDays = 14; // days
export const genreQuotaPercentage = 10; // percent

// request service
export const useLocalCache = false; // only applies in development
export const cacheWebworkerUrl = 'https://bertabot.glencoden.io';

// storage service
export const minNumUnseenVideos = 50; // count
export const genreListStaleTime = 1000 * 60 * 60 * 24 * 7; // ms

/**
 * sizing
 */
export const defaultTileWidth = 1280; // px
export const minDeviceWidth = 600; // px
export const fullDeviceWidth = 1440; // px
export const maxMobileWidth = 900; // px
export const mobileContentMargin = 14; // px

export const navigationMargin = 2; // rem
export const navigationZIndex = 1000;
export const sidebarWidth = 80; // px

export const laneLeft = 110; // px
export const laneTop = 110; // px
export const laneTileOffset = 50; // px
export const hideTileSafetyOffset = 50; // px

export const progressBarWidth = 274; // px

export const controlsMargin = 2; // rem
export const controlsOverlayWidth = 38; // %

/**
 * timing
 */
export const laneTileSlideInDelay = 200; // ms
export const laneTileAnimationOffset = 50; // ms

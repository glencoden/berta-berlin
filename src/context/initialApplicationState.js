import { getTileSize } from './helpers/getTileSize';
import { isMobile } from './helpers/isMobile';
import { isViewportTooSmall } from './helpers/isViewportTooSmall';
import { TransitionType } from '../enums/TransitionType';

export const initialApplicationState = {
    isMenuOpen: !isMobile(),
    selectedConfig: null,
    currentTransition: TransitionType.NONE,
    hasVideoStarted: false,
    tileSize: getTileSize(),
    isMobile: isMobile(),
    isViewPortTooSmall: isViewportTooSmall(),
};
import { maxMobileWidth } from '../../variables';

export const isMobile = () => {
    return window.innerWidth <= maxMobileWidth;
};
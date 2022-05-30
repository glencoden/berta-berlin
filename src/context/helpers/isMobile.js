import { maxMobileWidth } from '../../styles/variables';

export const isMobile = () => {
    return window.innerWidth > maxMobileWidth;
}
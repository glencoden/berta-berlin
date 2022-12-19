import { minDeviceWidth } from '../../styles/variables';

export const isViewportTooSmall = () => {
    return window.innerWidth < minDeviceWidth;
};
import { minDeviceWidth } from '../../variables';

export const isViewportTooSmall = () => {
    return window.innerWidth < minDeviceWidth;
};
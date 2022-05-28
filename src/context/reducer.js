import { useReducer } from 'react';
import { ApplicationActionType } from './ApplicationActionType';
import { defaultTileSize, maxMobileWidth, minDeviceWidth } from '../styles/variables';

function isMobile() {
    return window.innerWidth > maxMobileWidth;
}

function isViewPortTooSmall() {
    return window.innerWidth < minDeviceWidth;
}

function reducer(state, action) {
    switch (action.type) {
        case ApplicationActionType.SET_MENU_OPEN:
            return {
                ...state,
                isMenuOpen: action.payload,
            };
        case ApplicationActionType.SET_SELECTED_CONFIG:
            return {
                ...state,
                isMenuOpen: false,
                selectedConfig: action.payload,
            };
        case ApplicationActionType.SET_VIDEO_STARTED:
            return {
                ...state,
                hasVideoStarted: action.payload,
            };
        case ApplicationActionType.SET_SIZE:
            return {
                ...state,
                size: action.payload,
            };
        case ApplicationActionType.CALC_IS_MOBILE:
            return {
                ...state,
                isMobile: isMobile(),
            };
        case ApplicationActionType.CALC_IS_VIEWPORT_TOO_SMALL:
            return {
                ...state,
                isViewPortTooSmall: isViewPortTooSmall(),
            };
        default:
            console.log('unknown application action type');
            return state;
    }
}

export const initialApplicationState = {
    isMenuOpen: false,
    selectedConfig: null,
    hasVideoStarted: false,
    size: defaultTileSize,
    isMobile: isMobile(),
    isViewPortTooSmall: isViewPortTooSmall(),
};

export const useApplicationReducer = () => useReducer(reducer, initialApplicationState);
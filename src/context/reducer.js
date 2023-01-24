import { useReducer } from 'react';
import { ApplicationActionType } from './ApplicationActionType';
import { getTileSize } from './helpers/getTileSize';
import { isMobile } from './helpers/isMobile';
import { isViewportTooSmall } from './helpers/isViewportTooSmall';
import { initialApplicationState } from './initialApplicationState';

function reducer(state, action) {
    switch (action.type) {
        case ApplicationActionType.SET_HAS_LOADED:
            return {
                ...state,
                hasLoaded: action.payload,
                isMenuOpen: !state.isMobile,
            };
        case ApplicationActionType.SET_MENU_OPEN:
            return {
                ...state,
                isMenuOpen: !state.isMobile || action.payload,
            };
        case ApplicationActionType.SET_SELECTED_CONFIG:
            return {
                ...state,
                isMenuOpen: state.isMobile ? false : state.hasLoaded,
                selectedConfig: action.payload,
            };
        case ApplicationActionType.SET_CURRENT_TRANSITION:
            return {
                ...state,
                currentTransition: action.payload,
            };
        case ApplicationActionType.SET_VIDEO_STARTED:
            return {
                ...state,
                hasVideoStarted: action.payload,
            };
        case ApplicationActionType.CALC_TILE_SIZE:
            return {
                ...state,
                tileSize: getTileSize(),
            };
        case ApplicationActionType.CALC_IS_MOBILE:
            return {
                ...state,
                isMobile: isMobile(),
            };
        case ApplicationActionType.CALC_IS_VIEWPORT_TOO_SMALL:
            return {
                ...state,
                isViewPortTooSmall: isViewportTooSmall(),
            };
        default:
            console.log('unknown application action type');
            return state;
    }
}

export const useApplicationReducer = () => useReducer(reducer, initialApplicationState);
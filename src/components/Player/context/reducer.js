import { useReducer } from 'react';
import { PlayerActionType } from './PlayerActionType';

function reducer(state, action) {
    switch (action.type) {
        case PlayerActionType.PLAY:
            return {
                ...state,
                isPlaying: true,
            };
        case PlayerActionType.STOP:
            return {
                ...state,
                isPlaying: false,
            };
        case PlayerActionType.SET_VIDEO:
            return {
                ...state,
                video: action.payload,
                playlist: null,
            };
        case PlayerActionType.SET_PLAYLIST:
            return {
                ...state,
                video: null,
                playlist: action.payload,
            };
        case PlayerActionType.SET_SIZE:
            return {
                ...state,
                size: action.payload,
            };
        case PlayerActionType.SET_POSITION:
            return {
                ...state,
                position: action.payload,
            };
        default:
            console.log('unknown player action type');
            return state;
    }
}

export const initialPlayerState = {
    isPlaying: false,
    video: null,
    playlist: null,
    size: {
        width: 640,
        height: 360,
    },
    position: {
        left: 0,
        top: 0,
    },
};

export const usePlayerReducer = () => useReducer(reducer, initialPlayerState);
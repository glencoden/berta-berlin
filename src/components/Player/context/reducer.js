import { useReducer } from 'react';
import { PlayerActionType } from './PlayerActionType';
import { initialPlayerState } from './initialPlayerState';

function reducer(state, action) {
    switch (action.type) {
        case PlayerActionType.PLAY:
            return {
                ...state,
                shouldPlay: true,
            };
        case PlayerActionType.STOP:
            return {
                ...state,
                shouldPlay: false,
            };
        case PlayerActionType.ON_PLAY:
            return {
                ...state,
                shouldPlay: true,
                isPlaying: true,
            };
        case PlayerActionType.ON_STOP:
            return {
                ...state,
                shouldPlay: false,
                isPlaying: false,
            };
        case PlayerActionType.SET_VIDEO:
            return {
                ...state,
                shouldPlay: true,
                video: action.payload,
                playlist: null,
            };
        case PlayerActionType.SET_PLAYLIST:
            return {
                ...state,
                shouldPlay: true,
                video: null,
                playlist: action.payload,
            };
        case PlayerActionType.SET_PLAYER_SIZE:
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

export const usePlayerReducer = () => useReducer(reducer, initialPlayerState);
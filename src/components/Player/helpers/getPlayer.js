// Youtube player javascript API https://developers.google.com/youtube/iframe_api_reference#Queueing_Functions

import { PlayerActionType } from '../context/PlayerActionType';

const POLL_INTERVAL = 50; // ms
const ERR_RETRY_TIMEOUT = 5; // seconds

let player = null;

export const getPlayer = (dispatch) => {
    if (player) {
        return Promise.resolve(player);
    }

    if (!window.YT) {
        return new Promise(resolve => setTimeout(() => resolve(getPlayer(dispatch)), POLL_INTERVAL));
    }

    return new Promise((resolve) => {
        window.YT.ready(() => {
            player = new window.YT.Player('youtube-player', {
                playerVars: {
                    enablejsapi: 1,
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onError,
                },
            });

            function onPlayerReady() {
                resolve(player);
            }

            let onErrorTimeoutId = 0;

            function onError(err) {
                console.warn(`Player error. Retry in ${ERR_RETRY_TIMEOUT} seconds, unless player state changes to 'playing'.`, err);
                clearTimeout(onErrorTimeoutId);
                onErrorTimeoutId = setTimeout(() => {
                    dispatch({
                        type: PlayerActionType.STOP,
                    });
                    setTimeout(() => {
                        dispatch({
                            type: PlayerActionType.PLAY,
                        });
                    }, 500);
                }, ERR_RETRY_TIMEOUT * 1000);
            }

            function onPlayerStateChange(event) {
                switch (event.data) {
                    case window.YT?.PlayerState.ENDED:
                        dispatch({ type: PlayerActionType.ON_STOP });
                        break;
                    case window.YT?.PlayerState.PLAYING:
                        clearTimeout(onErrorTimeoutId);
                        dispatch({ type: PlayerActionType.ON_PLAY });
                        break;
                    case window.YT?.PlayerState.PAUSED:
                        dispatch({ type: PlayerActionType.ON_STOP });
                        break;
                    case window.YT?.PlayerState.BUFFERING:
                    case window.YT?.PlayerState.CUED:
                    default:
                }
            }
        });
    });
};
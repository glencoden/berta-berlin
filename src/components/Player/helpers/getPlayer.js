// Youtube player javascript API https://developers.google.com/youtube/iframe_api_reference#Queueing_Functions

import { PlayerActionType } from '../context/PlayerActionType';

const POLL_INTERVAL = 50; // ms

let player = null;

export const getPlayer = (dispatch) => {
    if (player) {
        return Promise.resolve(player);
    }

    if (!window.YT) {
        return new Promise(resolve => setTimeout(() => resolve(getPlayer(dispatch)), POLL_INTERVAL));
    }

    return new Promise((resolve, reject) => {
        window.YT.ready(() => {
            player = new window.YT.Player('youtube-player', {
                playerVars: {
                    // controls: 0,
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

            function onError(err) {
                reject(err);
            }

            function onPlayerStateChange(event) {
                switch (event.data) {
                    case window.YT?.PlayerState.ENDED:
                        dispatch({ type: PlayerActionType.ON_STOP });
                        break;
                    case window.YT?.PlayerState.PLAYING:
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
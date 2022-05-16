// Youtube player javascript API https://developers.google.com/youtube/iframe_api_reference#Queueing_Functions

const POLL_INTERVAL = 50; // ms

let player = null;

export const getPlayer = () => {
    if (player) {
        return Promise.resolve(player);
    }

    console.log('window.YT', window.YT)

    if (!window.YT) {
        return new Promise(resolve => setTimeout(() => resolve(getPlayer()), POLL_INTERVAL));
    }

    return new Promise((resolve, reject) => {
        window.YT.ready(() => {
            player = new window.YT.Player('youtube-player', {
                playerVars: {
                    // autoplay: 0,
                    controls: 0,
                    enablejsapi: 1
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onError
                },
            });

            function onPlayerReady() {
                resolve(player);
            }

            function onError(err) {
                reject(err);
            }

            function onPlayerStateChange(event) {
                console.log('onPlayerStateChange', event); // TODO do sth with this or remove it
            }
        });
    });
}
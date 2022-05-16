import { useEffect, useState } from 'react';
import { requestService } from './services/requestService';

let MOUNTED = false;

let player = null;

function makePlayer(id) {
    if (player) {
        return Promise.resolve(player);
    }
    if (!window.YT) {
        return new Promise(resolve => {
            setTimeout(() => resolve(makePlayer(id)), 1000);
        });
    }

    player = new window.YT.Player('player', {
        height: '360',
        width: '640',
        videoId: id,
        playerVars: { autoplay: 1, controls: 0 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        },
    });

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        // console.log('event.target', event.target)
        // setTimeout(player.playVideo, 3000)
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    let done = false;

    function onPlayerStateChange(event) {
        if (event.data === window.YT.PlayerState.PLAYING && !done) {
            // setTimeout(stopVideo, 6000);
            // setTimeout(() => console.log(player.getOptions()), 8000);
            done = true;
        }
    }

    // function stopVideo() {
    //     player.stopVideo();
    // }

    return Promise.resolve(player);
}

function App() {
    const [ videoId, setVideoId ] = useState('');

    useEffect(() => {
        if (MOUNTED) {
            return;
        }
        MOUNTED = true;

        requestService.getVideos()

        setVideoId('hbx-atIPXxA');
    }, []);

    useEffect(() => {
        if (!videoId) {
            return;
        }
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        makePlayer(videoId);
    }, [ videoId ]);

    const onPlay = () => {
        if (player === null) {
            console.log('no player')
            return
        }
        console.log('glen was here', player)
        player.playVideo()
    }

    return (
        <div>
            <div className="text-3xl font-bold text-center py-12">
                glen coden - berta berlin
            </div>

            <button style={{ width: '100px', height: '50px', backgroundColor: 'lime' }} type="button" onClick={onPlay} />

            {/*<iframe*/}
            {/*    src={`https://www.youtube.com/embed/${videoId}`}*/}
            {/*    frameBorder="0"*/}
            {/*    allow="autoplay; encrypted-media"*/}
            {/*    allowFullScreen*/}
            {/*    title="video"*/}
            {/*/>*/}

            <div id="player"/>

            <iframe
                title="berta berlin playlist"
                width="640"
                height="360"
                src="http://www.youtube.com/embed/videoseries?list=PL5E56nME5FEWLqVOK-vo40vViHTIBc3vn"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        </div>
    );
}

export default App;

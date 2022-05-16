import { useEffect } from 'react';
import { getPlayer } from './helpers/getPlayer';
import { usePlayerContext } from './context';

let PLAYER_INITIATED = false;

/**
 * This component should only be rendered once
 */
function Player() {
    const { state } = usePlayerContext();

    /**
     * Init youtube player instance
     */
    useEffect(() => {
        if (PLAYER_INITIATED) {
            return;
        }
        PLAYER_INITIATED = true;

        const playerScript = document.createElement('script');
        playerScript.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(playerScript);
    }, []);

    // TODO refactor below
    // player.loadVideoById('1_jOHpHwGoo')
    // player.setSize(1000, 600)
    // player.loadPlaylist({
    //     listType: 'playlist',
    //     list: 'PL5E56nME5FEVq_73oZ29ch-EWBa1jIuDj'
    // })

    const onPlay = () => {
        if (state.video === null) {
            return;
        }
        getPlayer().then(player => {
            player.loadVideoById(state.video.id);
        });
    };

    const onPause = () => {
        getPlayer().then(player => {
            player.stopVideo();
        });
    };

    return (
        <div>
            <div id="youtube-player"/>

            <button style={{ width: '100px', height: '50px', backgroundColor: 'blue' }} type="button" onClick={onPlay}/>
            <button style={{ width: '100px', height: '50px', backgroundColor: 'red' }} type="button" onClick={onPause}/>
        </div>
    );
}

export default Player;
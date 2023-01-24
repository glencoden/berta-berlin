import { useEffect, useRef, useState } from 'react';
import { getPlayer } from './helpers/getPlayer';
import { usePlayerContext } from './context';
import { StyledPlayer } from './styled-components/StyledPlayer';

let PLAYER_INITIATED = false;

/**
 * This component should only be rendered once
 */
function Player({ className, hasVideoStarted }) {
    const { playerState, dispatch } = usePlayerContext();

    const [ player, setPlayer ] = useState(null);

    const playerElement = useRef(null);

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

        getPlayer(dispatch).then(setPlayer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Play/pause on player state shouldPlay change
     */
    useEffect(() => {
        if (player === null) {
            return;
        }
        playerState.shouldPlay
            ? player.playVideo()
            : player.pauseVideo();
    }, [ playerState.shouldPlay, player ]);

    /**
     * Play video when not null
     */
    useEffect(() => {
        if (playerState.video === null || player === null) {
            return;
        }
        player.loadVideoById(playerState.video.id);
    }, [ playerState.video, player ]);

    /**
     * Play playlist when not null
     */
    useEffect(() => {
        if (playerState.playlist === null || player === null) {
            return;
        }
        player.loadPlaylist({
            listType: 'playlist',
            list: playerState.playlist.id,
        });
    }, [ playerState.playlist, player ]);

    /**
     * Set size when it changes
     */
    useEffect(() => {
        if (player === null) {
            return;
        }
        player.setSize(playerState.size.width, playerState.size.height);
    }, [ playerState.size, player ]);

    /**
     * Set position when it changes
     */
    // implement useEffect

    return (
        <StyledPlayer
            className={className}
            hasVideoStarted={hasVideoStarted}
        >
            <div
                id="youtube-player"
                ref={playerElement}
            />
        </StyledPlayer>
    );
}

export default Player;
import { useEffect } from 'react';
import { usePlayerContext } from '../Player/context';
import { PlayerActionType } from '../Player/context/PlayerActionType';
import Button from '@mui/material/Button';

const VideoTileRatioType = {
    EXTENDED: 'extended',
    COLLAPSED: 'collapsed',
};

function getVideoTileHeight(width, ratioType) {
    switch (ratioType) {
        case VideoTileRatioType.EXTENDED:
            return Math.round(width * 9 / 16);
        case VideoTileRatioType.COLLAPSED:
            return Math.round(width * 9 / 21);
        default:
            return Math.round(width * 9 / 16);
    }
}

function isActiveTile(playerState, video, playlist) {
    return (playerState.video !== null && playerState.video.id === video?.id)
        || (playerState.playlist !== null && playerState.playlist.id === playlist?.id);
}

/**
 * Renders a thumbnail and starts the player on user interaction
 */
function VideoTile({ video, playlist, width }) {
    const { playerState, dispatch } = usePlayerContext();

    // TODO do this in tile grid
    useEffect(() => {
        if (!isActiveTile(playerState, video, playlist)) {
            return;
        }
        dispatch({
            type: PlayerActionType.SET_SIZE,
            payload: {
                width,
                height: getVideoTileHeight(width, VideoTileRatioType.EXTENDED),
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ width, playerState.video, playerState.playlist ]);

    const onPlay = () => {
        if (video !== null) {
            dispatch({
                type: PlayerActionType.SET_VIDEO,
                payload: video,
            });
        } else if (playlist !== null) {
            dispatch({
                type: PlayerActionType.SET_PLAYLIST,
                payload: playlist,
            });
        }
    };

    return (
        <div>
            {!playerState.isPlaying && <Button variant="contained" onClick={onPlay}>&#9658; PLAY</Button>}
        </div>
    );
}

export default VideoTile;
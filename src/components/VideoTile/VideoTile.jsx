import { useEffect } from 'react';
import { usePlayerContext } from '../Player/context';
import { PlayerActionType } from '../Player/context/PlayerActionType';

/**
 * Renders a thumbnail and starts the player on user interaction
 */
function VideoTile({ video }) {
    const { dispatch } = usePlayerContext();

    useEffect(() => {
        if (video === null) {
            return;
        }
        dispatch({
            type: PlayerActionType.SET_VIDEO,
            payload: video,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ video ]);

    return <div>Video Tile</div>;
}

export default VideoTile;
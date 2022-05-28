import { StyledPlayerOverlay } from './styled-components/StyledPlayerOverlay';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { PlayerActionType } from '../../../Player/context/PlayerActionType';
import { ResourceType } from '../../../../enums/ResourceType';
import { usePlayerContext } from '../../../Player/context';
import { StyledPlayerOverlayDescription } from './styled-components/StyledPlayerOverlayDescription';
import { StyledPlayerOverlayPlayButton } from './styled-components/StyledPlayerOverlayPlayButton';
import { useParsedDescription } from '../../hooks/useParsedDescription';
import { editorService } from '../../../../services/editorService';


function PlayerOverlay({ className, size, activeItem, visible }) {
    const { playerState, dispatch } = usePlayerContext();

    const [ prevActiveItem, setPrevActiveItem ] = useState(activeItem);
    const [ videoHasStarted, setVideoHasStarted ] = useState(false);

    const parsedDescription = useParsedDescription(activeItem);

    /**
     * Apply player size
     */
    useEffect(() => {
        dispatch({
            type: PlayerActionType.SET_SIZE,
            payload: size,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ size ]);

    /**
     * Play callback
     */
    const onPlay = useCallback(() => {
        if (!activeItem) {
            return;
        }
        switch (editorService.resourceType) {
            case ResourceType.VIDEO:
                dispatch({
                    type: PlayerActionType.SET_VIDEO,
                    payload: activeItem,
                });
                break;
            case ResourceType.PLAYLIST:
                dispatch({
                    type: PlayerActionType.SET_PLAYLIST,
                    payload: activeItem,
                });
                break;
            default:
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ activeItem ]);

    /**
     * Pause callback
     */
    const onPause = useCallback(() => {
        setVideoHasStarted(false);
        dispatch({
            type: PlayerActionType.STOP,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Pause player on active item change
     */
    useEffect(() => {
        if (activeItem === prevActiveItem) {
            return;
        }
        setPrevActiveItem(activeItem);
        onPause();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ activeItem, onPause ]);

    /**
     * Set has started when player is playing for the first time since active item changed
     */
    useEffect(() => {
        if (!playerState.isPlaying) {
            return;
        }
        setVideoHasStarted(true);
    }, [ playerState.isPlaying ]);

    if (!activeItem) {
        return null;
    }

    const isVideoLoading = playerState.shouldPlay !== playerState.isPlaying;

    return (
        <StyledPlayerOverlay
            className={className}
            size={size}
            visible={visible}
            videoHasStarted={videoHasStarted}
        >
            <StyledPlayerOverlayDescription>
                <Typography
                    variant="h4"
                    color="white"
                >
                    {activeItem.title}
                </Typography>

                <Typography
                    variant="h6"
                    color="white"
                >
                    {parsedDescription.detail}
                </Typography>
            </StyledPlayerOverlayDescription>

            <StyledPlayerOverlayPlayButton size={size}>
                {!playerState.isPlaying && (
                    <Button
                        className="play-button"
                        style={{ fontSize: '2rem' }}
                        variant="contained"
                        size="large"
                        disable={isVideoLoading}
                        onClick={playerState.isPlaying ? onPause : onPlay}
                    >
                        {isVideoLoading ? <CircularProgress /> : <>&#9658;</>}&nbsp;Play
                    </Button>
                )}
            </StyledPlayerOverlayPlayButton>
        </StyledPlayerOverlay>
    );
}

export default PlayerOverlay;
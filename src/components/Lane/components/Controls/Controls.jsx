import { StyledControls } from './styled-components/StyledControls';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useState } from 'react';
import { PlayerActionType } from '../../../Player/context/PlayerActionType';
import { ResourceType } from '../../../../enums/ResourceType';
import { usePlayerContext } from '../../../Player/context';
import { StyledControlsOverlay } from './styled-components/StyledControlsOverlay';
import { Typography } from '@mui/material';
import { StyledControlsPlayToggleButton } from './styled-components/StyledControlsPlayToggleButton';
import { useParsedDescription } from '../../hooks/useParsedDescription';


function Controls({ className, size, activeItem, resourceType, showControls }) {
    const { playerState, dispatch } = usePlayerContext();

    const [ prevActiveItem, setPrevActiveItem ] = useState(activeItem);

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
        switch (resourceType) {
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
    }, [ activeItem, resourceType ]);

    /**
     * Pause callback
     */
    const onPause = useCallback(() => {
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

    if (!activeItem) {
        return null;
    }

    return (
        <StyledControls
            className={className}
            size={size}
            show={showControls}
        >
            <StyledControlsOverlay isPlaying={playerState.isPlaying}>
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
            </StyledControlsOverlay>

            <StyledControlsPlayToggleButton>
                <Button
                    variant="contained"
                    size="large"
                    disabled={playerState.shouldPlay !== playerState.isPlaying}
                    onClick={playerState.isPlaying ? onPause : onPlay}
                >
                    {playerState.isPlaying ? 'PAUSE' : 'PLAY'}
                </Button>
            </StyledControlsPlayToggleButton>
        </StyledControls>
    );
}

export default Controls;
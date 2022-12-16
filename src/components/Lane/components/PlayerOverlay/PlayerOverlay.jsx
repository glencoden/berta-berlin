import { StyledPlayerOverlay } from './styled-components/StyledPlayerOverlay';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect } from 'react';
import { PlayerActionType } from '../../../Player/context/PlayerActionType';
import { usePlayerContext } from '../../../Player/context';
import { StyledPlayerOverlayDescription } from './styled-components/StyledPlayerOverlayDescription';
import { StyledPlayerOverlayPlayButton } from './styled-components/StyledPlayerOverlayPlayButton';
import { useParsedDescription } from '../../hooks/useParsedDescription';
import { useApplicationContext } from '../../../../context';
import { ApplicationActionType } from '../../../../context/ApplicationActionType';
import { storageService } from '../../../../services/storageService';

const PLAY_BUTTON_STYLE = { fontSize: '2rem' };


function PlayerOverlay({ className, activeItem, visible }) {
    const { appState, dispatch: appDispatch } = useApplicationContext();

    const { playerState, dispatch: playerDispatch } = usePlayerContext();

    const parsedDescription = useParsedDescription(activeItem);

    /**
     * Apply player size
     */
    useEffect(() => {
        playerDispatch({
            type: PlayerActionType.SET_PLAYER_SIZE,
            payload: appState.tileSize,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ appState.tileSize ]);

    /**
     * Play callback
     */
    const onPlay = useCallback(() => {
        console.log('==== ACTIVE ITEM ====', activeItem);
        if (!activeItem) {
            return;
        }
        storageService.setSeenVideoIds(activeItem);
        storageService.setRecentlyWatchedGenres(activeItem);

        playerDispatch({
            type: PlayerActionType.SET_VIDEO,
            payload: activeItem,
        });

        /**
         * This switch would allow usage of the youtube player playlist functionality
         */
        // switch (appState.selectedConfig?.resourceType) {
        //     case ResourceType.VIDEO:
        //         playerDispatch({
        //             type: PlayerActionType.SET_VIDEO,
        //             payload: activeItem,
        //         });
        //         break;
        //     case ResourceType.PLAYLIST:
        //         playerDispatch({
        //             type: PlayerActionType.SET_PLAYLIST,
        //             payload: activeItem,
        //         });
        //         break;
        //     default:
        // }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ appState.selectedConfig, activeItem ]);

    /**
     * Pause callback
     */
    const onPause = useCallback(() => {
        playerDispatch({
            type: PlayerActionType.STOP,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Pause player on active item change
     */
    useEffect(() => {
        if (activeItem === null) {
            return;
        }
        appDispatch({
            type: ApplicationActionType.SET_VIDEO_STARTED,
            payload: false,
        });
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
        appDispatch({
            type: ApplicationActionType.SET_VIDEO_STARTED,
            payload: true,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ playerState.isPlaying ]);

    if (!activeItem) {
        return null;
    }

    const isVideoLoading = playerState.shouldPlay !== playerState.isPlaying;

    return (
        <StyledPlayerOverlay
            className={className}
            size={appState.tileSize}
            visible={visible}
            hasVideoStarted={appState.hasVideoStarted}
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

            <StyledPlayerOverlayPlayButton size={appState.tileSize}>
                {!appState.hasVideoStarted && (
                    <Button
                        className="play-button"
                        style={PLAY_BUTTON_STYLE}
                        variant="contained"
                        size="large"
                        disable={isVideoLoading}
                        onClick={playerState.isPlaying ? onPause : onPlay}
                    >
                        {isVideoLoading ? <CircularProgress color="info"/> : <>&#9658;</>}&nbsp;Play
                    </Button>
                )}
            </StyledPlayerOverlayPlayButton>
        </StyledPlayerOverlay>
    );
}

export default PlayerOverlay;
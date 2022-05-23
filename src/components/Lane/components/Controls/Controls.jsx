import { StyledControls } from './styled-components/StyledControls';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useState } from 'react';
import { PlayerActionType } from '../../../Player/context/PlayerActionType';
import { ResourceType } from '../../../../enums/ResourceType';
import { usePlayerContext } from '../../../Player/context';


function Controls({ className, size, activeItem, resourceType }) {
    const { playerState, dispatch } = usePlayerContext();

    const [ prevActiveItem, setPrevActiveItem ] = useState(activeItem);

    useEffect(() => {
        dispatch({
            type: PlayerActionType.SET_SIZE,
            payload: size,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ size ]);

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

    const onPause = useCallback(() => {
        dispatch({
            type: PlayerActionType.STOP,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (activeItem === prevActiveItem) {
            return;
        }
        setPrevActiveItem(activeItem);
        onPause();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ activeItem, onPause ]);

    return (
        <StyledControls className={className}>
            <Button variant="contained" onClick={onPlay}>&#9658; PLAY</Button>
            <Button variant="outlined" onClick={onPause}>&#9658; PAUSE</Button>
        </StyledControls>
    );
}

export default Controls;
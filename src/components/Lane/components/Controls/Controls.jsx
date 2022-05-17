import Button from '@mui/material/Button';
import { LaneItemType } from '../../enums/LaneItemType';
import { PlayerActionType } from '../../../Player/context/PlayerActionType';
import { usePlayerContext } from '../../../Player/context';


function Controls({ item, type }) {
    const { dispatch } = usePlayerContext();

    const onPlay = () => {
        if (!item) {
            return;
        }
        switch (type) {
            case LaneItemType.VIDEO:
                dispatch({
                    type: PlayerActionType.SET_VIDEO,
                    payload: item,
                });
                break;
            case LaneItemType.PLAYLIST:
                dispatch({
                    type: PlayerActionType.SET_PLAYLIST,
                    payload: item,
                });
                break;
            default:
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={onPlay}>&#9658; PLAY</Button>
        </div>
    );
}

export default Controls;
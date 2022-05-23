import { StyledControls } from './styled-components/StyledControls';
import Button from '@mui/material/Button';


function Controls({ size, tile, onPlay }) {
    return (
        <StyledControls>
            <Button variant="contained" onClick={onPlay}>&#9658; PLAY</Button>
        </StyledControls>
    );
}

export default Controls;
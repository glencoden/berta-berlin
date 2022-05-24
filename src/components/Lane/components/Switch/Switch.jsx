import { StyledSwitch } from './styled-components/StyledSwitch';
import Button from '@mui/material/Button';
import { StyledProgressBar } from './styled-components/StyledProgressBar';

function Switch({ size, onPrev, onNext, numTiles, activeIndex }) {

    if (isNaN(numTiles)) {
        return null;
    }

    return (
        <StyledSwitch size={size}>
            <Button onClick={onPrev}>previous</Button>

            <StyledProgressBar
                numTiles={numTiles}
                activeIndex={activeIndex}
            >
                <div className="progress-bar-scale" />
                <div className="progress-bar-indicator" />
            </StyledProgressBar>

            <Button onClick={onNext}>next</Button>
        </StyledSwitch>
    );
}

export default Switch;
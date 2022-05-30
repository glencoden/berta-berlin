import { StyledTileSwitch } from './styled-components/StyledTileSwitch';
import Button from '@mui/material/Button';
import { StyledProgressBar } from './styled-components/StyledProgressBar';
import { useApplicationContext } from '../../../../context';

function TileSwitch({ onPrev, onNext, numTiles, activeIndex, visible }) {
    const { appState } = useApplicationContext();

    if (isNaN(numTiles)) {
        return null;
    }

    return (
        <StyledTileSwitch
            size={appState.tileSize}
            visible={visible}
        >
            <Button onClick={onPrev}>previous</Button>

            <StyledProgressBar
                numTiles={numTiles}
                activeIndex={activeIndex}
            >
                <div className="progress-bar-scale" />
                <div className="progress-bar-indicator" />
            </StyledProgressBar>

            <Button onClick={onNext}>next</Button>
        </StyledTileSwitch>
    );
}

export default TileSwitch;
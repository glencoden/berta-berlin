import { StyledTileSwitch } from './styled-components/StyledTileSwitch';
import Button from '@mui/material/Button';
import { useApplicationContext } from '../../../../context';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { StyledProgressBar } from './styled-components/StyledProgressBar';

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
            <Button onClick={onPrev}>
                <ArrowBackIosNew
                    fontSize="large"
                    className="arrow-icon"
                />
            </Button>

            <StyledProgressBar
                numTiles={numTiles}
                activeIndex={activeIndex}
            >
                <div className="progress-bar-scale" />
                <div className="progress-bar-indicator" />
            </StyledProgressBar>

            <Button onClick={onNext}>
                <ArrowForwardIos
                    fontSize="large"
                    className="arrow-icon"
                />
            </Button>
        </StyledTileSwitch>
    );
}

export default TileSwitch;
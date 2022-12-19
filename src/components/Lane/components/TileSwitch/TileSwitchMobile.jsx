import IconButton from '@mui/material/IconButton';
import { StyledMobileTileSwitchButton } from './styled-components/StyledMobileTileSwitchButton';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

function TileSwitchMobile({ onPrev, onNext, numTiles }) {
    if (isNaN(numTiles)) {
        return null;
    }
    return (
        <>
            <StyledMobileTileSwitchButton moveRight={false}>
                <IconButton
                    onClick={onPrev}
                    className="icon-button"
                >
                    <ArrowBackIosNew
                        fontSize="large"
                        className="arrow-icon"
                    />
                </IconButton>
            </StyledMobileTileSwitchButton>

            <StyledMobileTileSwitchButton moveRight={true}>
                <IconButton
                    onClick={onNext}
                    className="icon-button"
                >
                    <ArrowForwardIos
                        fontSize="large"
                        className="arrow-icon"
                    />
                </IconButton>
            </StyledMobileTileSwitchButton>
        </>
    );
}

export default TileSwitchMobile;
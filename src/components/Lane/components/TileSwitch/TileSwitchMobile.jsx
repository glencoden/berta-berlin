import IconButton from '@mui/material/IconButton';
import { StyledMobileTileSwitchButton } from './styled-components/StyledMobileTileSwitchButton';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'

function TileSwitchMobile({ onPrev, onNext, numTiles }) {
    if (isNaN(numTiles)) {
        return null;
    }

    return (
        <>
            <StyledMobileTileSwitchButton moveRight={false}>
                <IconButton onClick={onPrev}>
                    <ArrowBackIosNew
                        fontSize="large"
                        style={{ color: 'white' }}
                    />
                </IconButton>
            </StyledMobileTileSwitchButton>

            <StyledMobileTileSwitchButton moveRight={true}>
                <IconButton onClick={onNext}>
                    <ArrowForwardIos
                        fontSize="large"
                        style={{ color: 'white' }}
                    />
                </IconButton>
            </StyledMobileTileSwitchButton>
        </>
    );
}

export default TileSwitchMobile;
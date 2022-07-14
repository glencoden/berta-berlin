import IconButton from '@mui/material/IconButton';
import { StyledMobileTileSwitchButton } from './styled-components/StyledMobileTileSwitchButton';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

const ICON_BUTTON_STYLE = { backgroundColor: '#330e62', opacity: '0.5' };
const ICON_STYLE = { color: 'white' };

function TileSwitchMobile({ onPrev, onNext, numTiles }) {
    if (isNaN(numTiles)) {
        return null;
    }

    return (
        <>
            <StyledMobileTileSwitchButton moveRight={false}>
                <IconButton
                    onClick={onPrev}
                    style={ICON_BUTTON_STYLE}
                >
                    <ArrowBackIosNew
                        fontSize="large"
                        style={ICON_STYLE}
                    />
                </IconButton>
            </StyledMobileTileSwitchButton>

            <StyledMobileTileSwitchButton moveRight={true}>
                <IconButton
                    onClick={onNext}
                    style={ICON_BUTTON_STYLE}
                >
                    <ArrowForwardIos
                        fontSize="large"
                        style={ICON_STYLE}
                    />
                </IconButton>
            </StyledMobileTileSwitchButton>
        </>
    );
}

export default TileSwitchMobile;
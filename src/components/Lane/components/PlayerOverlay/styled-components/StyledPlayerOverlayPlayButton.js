import styled from '@emotion/styled';
import { controlsOverlayWidth } from '../../../../../styles/variables';

export const StyledPlayerOverlayPlayButton = styled.div`
    position: absolute;
    right: ${({ size }) => {
        const rightTileAreaWidth = size.width - (size.width * controlsOverlayWidth / 100);
        return rightTileAreaWidth / 2;
    }}px;
    top: 50%;
    transform: translate(50%, -50%);
    
    .play-button {
        font-size: 2rem;
    }
`;
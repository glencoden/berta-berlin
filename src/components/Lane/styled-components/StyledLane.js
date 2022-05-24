import styled from '@emotion/styled';
import { laneLeft, laneTop } from '../../../styles/variables';

export const StyledLane = styled.div`
    position: absolute;
    left: ${laneLeft}px;
    top: ${laneTop}px;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => size.height}px;
    transform: translateY(${({ navigationOpen }) => navigationOpen ? `${laneTop / 2}px` : '0'});
    transition: transform ${({ theme }) => (theme.transitions.duration.standard / 1000)}s;
    
    .lane-video-detail {
        z-index: ${({ numTiles }) => numTiles ? numTiles - 1 : -1};
    }
    
    .lane-player {
        position: relative;
        z-index: ${({ numTiles }) => numTiles ? numTiles + 1 : -1};
    }
    
    .lane-controls {
        z-index: ${({ numTiles }) => numTiles ? numTiles + 2 : -1};
    }
`;
import styled from '@emotion/styled';
import { laneLeft, laneTop, mobileContentMargin, sidebarWidth } from '../../../styles/variables';
import { isMobile } from '../../../context/helpers/isMobile';

export const StyledLane = styled.div`
    position: ${isMobile() ? 'fixed' : 'absolute'};
    left: ${isMobile() ? (sidebarWidth + mobileContentMargin) : laneLeft}px;
    top: ${isMobile() ? mobileContentMargin : laneTop}px;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => 2 * size.height}px;
    transform: translateY(${({ isMenuOpen }) => isMenuOpen ? `${laneTop / 2}px` : '0'});
    transition: transform ${({ theme }) => (theme.transitions.duration.standard / 1000)}s;
    
    .lane-video-detail {
        z-index: ${({ numTiles }) => numTiles ? numTiles - 1 : -1};
    }
    
    .lane-player {
        position: relative;
        z-index: ${({ numTiles }) => numTiles ? numTiles + 1 : -1};
    }
    
    .lane-player-overlay {
        z-index: ${({ numTiles }) => numTiles ? numTiles + 2 : -1};
    }
`;
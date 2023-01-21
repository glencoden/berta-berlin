import styled from '@emotion/styled';
import { laneLeft, laneTop, mobileContentMargin, sidebarWidth } from '../../../variables';
import { isMobile } from '../../../context/helpers/isMobile';

export const StyledLane = styled.div`
    @keyframes slide-in {
        0% {
            translate: -200% 0;
        }
        100% {
            translate: 0 0;
        }
    }
    
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
    
    ::before {
        content: '';
        translate: ${({ hasLoaded }) => hasLoaded ? '0 0' : '-200% 0'};
        animation: ${({ hasLoaded }) => hasLoaded ? `slide-in 1s` : 'none'};
        position: absolute;
        left: -${isMobile() ? (sidebarWidth + mobileContentMargin) : laneLeft}px;
        top: ${({ size }) => size.height / 2}px;
        width: ${({ size }) => size.width / 3}px;
        height: ${({ size }) => size.width / 3}px;
        background-color: ${({ theme }) => theme.palette.primary.dark};
        transform-origin: 0 0;
        rotate: 45deg;
    }

    ::after {
        content: '';
        position: absolute;
        left: -${isMobile() ? (sidebarWidth + mobileContentMargin) : laneLeft}px;
        top: 0;
        width: ${sidebarWidth + 3}px;
        height: ${({ size }) => 2 * size.height}px;
        background-color: ${({ theme }) => theme.palette.background.paper};
    }
`;
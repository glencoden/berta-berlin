import styled from '@emotion/styled';
import { animationLong, laneItemOffset } from '../../../../../styles/variables';

const getTileHideOffset = ({ size }) => {
    return size.width + window.innerWidth;
};

export const StyledTile = styled.div`
    @keyframes slide-in {
        0% {
            transform: translateX(-${getTileHideOffset}px);
        }
        100% {
            transform: translateX(0);
        }
    }
    
    @keyframes slide-out {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-${getTileHideOffset}px);
        }
    }
    
    animation: ${({ visible }) => visible ? 'slide-in' : 'slide-out'} ${animationLong}s ease-out ${({ animationDelay }) => animationDelay}s;

    position: absolute;
    left: ${({ index }) => -(index * laneItemOffset)}px;
    top: 0;
    transform: translateX(0);
    transform: translateX(-${getTileHideOffset}px);
`;
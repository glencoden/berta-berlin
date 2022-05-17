import styled from '@emotion/styled';
import { laneItemOffset, laneLeft, laneTop, showTileClassname } from '../../../styles/variables';

export const StyledLane = styled.div`
    position: absolute;
    left: ${laneLeft}px;
    top: ${laneTop}px;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => size.height}px;
    transform: translateX(${({ offset }) => offset * laneItemOffset}px);
    
    .${showTileClassname} {
        transform: translateX(0);
    }
`;
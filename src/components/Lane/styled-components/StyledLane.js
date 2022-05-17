import styled from '@emotion/styled';
import { laneLeft, laneTileHideClass, laneTop } from '../../../styles/variables';
import { getHideTileOffset } from '../helpers/getHideTileOffset';

export const StyledLane = styled.div`
    position: absolute;
    left: ${laneLeft}px;
    top: ${laneTop}px;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => size.height}px;
    
    .${laneTileHideClass} {
        transform: translateX(-${({ size }) => getHideTileOffset(size.width)}px);
    }
`;
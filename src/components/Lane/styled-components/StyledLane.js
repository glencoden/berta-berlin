import styled from '@emotion/styled';
import { laneItemOffset, laneLeft, laneTop } from '../../../styles/variables';

export const StyledLane = styled.div`
    position: absolute;
    left: ${({ numItems }) => laneLeft + (Math.max(numItems - 1, 0) * laneItemOffset)}px;
    top: ${laneTop}px;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => size.height}px;
`;
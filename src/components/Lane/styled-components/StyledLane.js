import styled from '@emotion/styled';
import { laneLeft, laneTop } from '../../../styles/variables';

export const StyledLane = styled.div`
    position: absolute;
    left: ${laneLeft}px;
    top: ${laneTop}px;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => size.height}px;
`;
import styled from '@emotion/styled';
import { laneItemOffset } from '../../../../../styles/variables';

export const StyledTile = styled.div`
    position: absolute;
    right: ${({ index }) => index * laneItemOffset}px;
    top: 0;
`;
import styled from '@emotion/styled';
import { animationLong } from '../../../styles/variables';

export const StyledTile = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    z-index: ${({ zIndex }) => zIndex};
    transform: translateX(${({ transform }) => transform}px);
    transition-duration: ${animationLong}s;
`;
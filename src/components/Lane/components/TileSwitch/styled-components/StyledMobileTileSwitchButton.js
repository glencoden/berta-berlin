import styled from '@emotion/styled';
import { navigationMargin } from '../../../../../styles/variables';

export const StyledMobileTileSwitchButton = styled.div`
    z-index: 10000;
    position: fixed;
    ${({ moveRight }) => moveRight ? 'right' : 'left'}: ${navigationMargin}rem;
    top: 50%;
    transform: translateY(-50%);
`;
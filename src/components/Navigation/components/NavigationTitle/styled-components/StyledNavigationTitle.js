import styled from '@emotion/styled';
import { laneLeft, navigationMargin } from '../../../../../styles/variables';

export const StyledNavigationTitle = styled.div`
    position: absolute;
    right: ${laneLeft}px;
    top: ${navigationMargin}rem;
    transform: ${({ visible }) => visible ? 'none' : `translate(0, calc(-${navigationMargin}rem - 100%))`};
    transition: transform ${({ theme }) => (theme.transitions.duration.standard / 1000)}s;
`;
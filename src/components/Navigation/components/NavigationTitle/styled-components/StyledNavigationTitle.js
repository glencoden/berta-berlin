import styled from '@emotion/styled';
import { fullDeviceWidth, laneLeft, navigationMargin } from '../../../../../styles/variables';

export const StyledNavigationTitle = styled.div`
    position: absolute;
    right: ${window.innerWidth >= fullDeviceWidth ? `${laneLeft}px` : `${navigationMargin}rem`};
    top: ${navigationMargin}rem;
    transform: ${({ visible }) => visible ? 'none' : `translate(0, calc(-${navigationMargin}rem - 100%))`};
    transition: transform ${({ theme }) => (theme.transitions.duration.standard / 1000)}s;
`;
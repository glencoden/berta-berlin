import styled from '@emotion/styled';
import { laneLeft, navigationMargin, navigationZIndex } from '../../../variables';

export const StyledNavigation = styled.div`
    position: absolute;
    left: ${laneLeft}px;
    top: ${navigationMargin}rem;
    z-index: ${navigationZIndex};
    background-color: ${({ theme }) => theme.palette.common.white};
    transform: translateX(${({ isOpen }) => isOpen ? '0' : `calc(-100% - ${2 * laneLeft}px)`});
    transition: transform ${({ theme }) => (theme.transitions.duration.standard / 1000)}s;

    .nav-button {
        margin-right: ${navigationMargin}rem;
    }

    .nav-dashboard {
        display: inline-block;
        margin-right: ${navigationMargin}rem;
    }
`;
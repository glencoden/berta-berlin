import styled from '@emotion/styled';
import { navigationMargin, navigationZIndex, sidebarWidth } from '../../../styles/variables';

export const StyledSidebar = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: ${sidebarWidth}px;
    height: 100vh;
    z-index: ${navigationZIndex};
    background-color: ${({ theme }) => theme.palette.primary.dark};
    
    .sidebar-burger-button {
        position: absolute;
        left: 50%;
        top: ${navigationMargin}rem;
        transform: translateX(-50%);
    }
`;
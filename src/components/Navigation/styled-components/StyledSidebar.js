import styled from '@emotion/styled';
import { navigationMargin, navigationZIndex, sidebarWidth } from '../../../variables';
import { isMobile } from "../../../context/helpers/isMobile";

export const StyledSidebar = styled.div`
    @keyframes slide-in {
        0% {
            transform: translateX(-${sidebarWidth}px);
        }
        100% {
            transform: translateX(0);
        }
    }

    animation: slide-in ${({ theme }) => (theme.transitions.duration.standard / 1000)}s ease;
    position: fixed;
    left: 0;
    top: 0;
    width: ${sidebarWidth}px;
    height: ${isMobile() ? `${window.innerHeight}px` : '100vh'};
    z-index: ${navigationZIndex};
    background-color: ${({ theme }) => theme.palette.primary.dark};

    .sidebar-burger-button {
        position: absolute;
        left: 50%;
        top: ${navigationMargin}rem;
        transform: translateX(-50%);
    }

    .sidebar-imprint-button {
        position: absolute;
        left: 50%;
        bottom: ${navigationMargin}rem;
        transform: translateX(-50%);
    }
    
    .sidebar-imprint-button-image-box {
        position: relative;
        width: 48px;
        height: 48px;
        border-radius: ${({ theme }) => theme.shape.borderRadius}px;
        overflow: hidden;
    }

    .sidebar-imprint-button-image {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;
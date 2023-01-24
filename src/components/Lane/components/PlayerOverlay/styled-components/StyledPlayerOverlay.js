import styled from '@emotion/styled';
import { isMobile } from '../../../../../context/helpers/isMobile';

export const StyledPlayerOverlay = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => size.height}px;
    opacity: ${({ visible }) => visible ? '1' : '0'};
    ${({ hasVideoStarted }) => hasVideoStarted ? `
        transform: translateY(${isMobile() ? 150 : 100}%);
        pointer-events: none;
    ` : ''}
    transition: opacity ${({ theme }) => (theme.transitions.duration.standard / 1000)}s, transform ${({ theme }) => (theme.transitions.duration.standard / 1000)}s;
`;
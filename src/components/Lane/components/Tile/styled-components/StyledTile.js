import styled from '@emotion/styled';

export const StyledTile = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: ${({ theme }) => theme.shadows[4]};
    z-index: ${({ zIndex }) => zIndex};
    transform: translateX(${({ transform }) => transform}px);
    opacity: ${({ isPlaying }) => isPlaying ? 0 : 1};
    transition: transform ${({ theme }) => (theme.transitions.duration.complex / 1000)}s, opacity ${({ theme }) => (theme.transitions.duration.shorter / 1000)}s;
`;
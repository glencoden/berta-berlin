import styled from '@emotion/styled';

export const StyledControls = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => size.height}px;
    opacity: ${({ show }) => show ? '1' : '0'};
    transform: translateY(${({ isPlaying }) => isPlaying ? '100%' : '0'});
    transition: opacity ${({ theme }) => (theme.transitions.duration.standard / 1000)}s, transform ${({ theme }) => (theme.transitions.duration.standard / 1000)}s;
`;
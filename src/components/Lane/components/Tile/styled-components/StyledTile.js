import styled from '@emotion/styled';

export const StyledTile = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => size.height}px;
    box-shadow: ${({ theme }) => theme.shadows[4]};
    z-index: ${({ zIndex }) => zIndex};
    transform: translateX(${({ transform }) => transform}px);
    transition: transform ${({ theme }) => (theme.transitions.duration.complex / 1000)}s;
`;
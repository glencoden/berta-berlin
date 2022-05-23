import styled from '@emotion/styled';

export const StyledControls = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: ${({ size }) => size.width}px;
    height: ${({ size }) => size.height}px;
`;
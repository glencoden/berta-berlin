import styled from '@emotion/styled';

export const StyledImage = styled.div`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    background-color: whitesmoke;
    overflow: hidden;

    .image {
        object-fit: cover;
        width: ${({ width }) => width}px;
        height: ${({ height }) => height}px;
        transition: opacity ${({ theme }) => (theme.transitions.duration.shorter / 1000)}s;
    }
`;
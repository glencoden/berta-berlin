import styled from '@emotion/styled';

// TODO get transition time from mui theme

export const StyledImage = styled.div`
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    background-color: whitesmoke;
    overflow: hidden;
    
    .image {
        object-fit: cover;
    }
`;
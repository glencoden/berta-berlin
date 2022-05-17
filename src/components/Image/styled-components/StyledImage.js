import styled from '@emotion/styled';

// TODO get transition time from mui theme

export const StyledImage = styled.div`
    .ImageBox {
        position: relative;
        width: ${({ width }) => width}px;
        height: ${({ height }) => height}px;
        background-color: whitesmoke;
        overflow: hidden;
    }
    
    .Image {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        transition: opacity 0.2s ease;
    }
`;
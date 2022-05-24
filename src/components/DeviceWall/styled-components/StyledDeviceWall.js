import styled from '@emotion/styled';

export const StyledDeviceWall = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${({ theme }) => theme.palette.background.default};
    
    .device-wall-content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;
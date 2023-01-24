import styled from '@emotion/styled';
import { isMobile } from '../../../context/helpers/isMobile';

export const StyledImprint = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(600px, 80vw);
    max-height: ${isMobile() ? 50 : 90}vh;
    overflow: scroll;
    padding: 2rem;
    box-shadow: ${({ theme }) => theme.shadows[4]};
    white-space: pre-line;
    background-color: ${({ theme }) => theme.palette.background.paper};
`;
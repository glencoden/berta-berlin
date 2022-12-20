import styled from '@emotion/styled';
import { controlsMargin, controlsOverlayWidth } from '../../../../../variables';

export const StyledPlayerOverlayDescription = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: ${controlsOverlayWidth}%;
    height: 100%;
    box-sizing: border-box;
    padding-bottom: calc(${controlsMargin}rem + 42px); // adding button height
    background-color: ${({ theme }) => theme.palette.action.active};
    overflow: scroll;

    > * {
        padding: ${controlsMargin}rem;
    }
`;
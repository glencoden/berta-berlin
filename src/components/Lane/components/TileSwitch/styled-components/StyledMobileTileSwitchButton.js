import styled from '@emotion/styled';
import { navigationMargin } from '../../../../../variables';

export const StyledMobileTileSwitchButton = styled.div`
    z-index: 10000;
    position: fixed;
    ${({ moveRight }) => moveRight ? 'right' : 'left'}: ${navigationMargin}rem;
    top: 50%;
    transform: translateY(-50%);

    .icon-button {
        background-color: rgba(51, 14, 98, 0.5);
    }

    .arrow-icon {
        color: ${({ theme }) => theme.common.white};
    }
`;
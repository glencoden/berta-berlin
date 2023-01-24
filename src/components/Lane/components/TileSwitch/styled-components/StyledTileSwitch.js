import styled from '@emotion/styled';
import { laneTop } from '../../../../../variables';

export const StyledTileSwitch = styled.div`
    display: flex;
    position: absolute;
    left: ${({ size }) => size.width / 2}px;
    top: -${laneTop / 2}px;
    transform: translateX(-50%);
    opacity: ${({ visible }) => visible ? '1' : '0'};
    transition: opacity ${({ theme }) => (theme.transitions.duration.standard / 1000)}s;

    .arrow-icon {
        color: ${({ theme }) => theme.palette.primary.main};
    }
`;
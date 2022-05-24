import styled from '@emotion/styled';
import { laneTop } from '../../../../../styles/variables';

export const StyledSwitch = styled.div`
    position: absolute;
    left: ${({ size }) => size.width / 2}px;
    top: -${laneTop / 2}px;
    transform: translateX(-50%);
    display: flex;
`;
import styled from '@emotion/styled';
import { progressBarWidth } from '../../../../../styles/variables';

export const StyledProgressBar = styled.div`
    position: relative;
    width: ${progressBarWidth}px;
    margin: 0 1rem;

    .progress-bar-scale {
        position: absolute;
        top: 50%;
        width: ${progressBarWidth}px;
        height: 4px;
        transform: translateY(-50%);
        background-color: ${({ theme }) => theme.palette.primary.main};
        box-shadow: ${({ theme }) => theme.shadows[2]};
    }

    .progress-bar-indicator {
        position: absolute;
        top: 50%;
        width: 12px;
        height: 12px;
        transform: translate(${({ numTiles, activeIndex }) => {
            const progressInPercent = 100 / (numTiles - 1) * activeIndex;
            return progressBarWidth * (progressInPercent / 100);
        }}px, -50%) rotate(45deg);
        transition: transform ${({ theme }) => (theme.transitions.duration.complex / 1000)}s;
        background-color: ${({ theme }) => theme.palette.primary.main};
        box-shadow: ${({ theme }) => theme.shadows[2]};
    }
`;
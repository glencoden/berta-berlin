import styled from '@emotion/styled';
import { controlsMargin, controlsOverlayWidth } from '../../../../../styles/variables';

export const StyledVideoDetail = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    width: ${({ size }) => (size.width * (100 - controlsOverlayWidth) / 100)}px;
    height: ${({ size }) => size.height}px;
    white-space: pre-line;
    box-sizing: border-box;
    padding: ${controlsMargin}rem;
    color: ${({ theme }) => theme.palette.primary.main};
    background-color: ${({ theme }) => theme.palette.background.paper};
    transform: translateY(${({ isPlaying }) => isPlaying ? '100%' : '0'});
    transition: transform ${({ theme }) => (theme.transitions.duration.short / 1000)}s;
    overflow: scroll;
    
    .video-detail-part {
        padding-bottom: ${controlsMargin}rem;
    }
`;
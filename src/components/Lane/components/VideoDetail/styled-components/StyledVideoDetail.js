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
    opacity: ${({ visible }) => visible ? '1' : '0'};
    transform: translateY(${({ isPlaying }) => isPlaying ? '100%' : '0'});
    transition: opacity ${({ theme }) => (theme.transitions.duration.standard / 1000)}s, transform ${({ theme }) => (theme.transitions.duration.standard / 1000)}s;
    overflow: scroll;
    
    .video-detail-part {
        padding-bottom: ${controlsMargin}rem;
    }
`;
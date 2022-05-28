import { useParsedDescription } from '../../hooks/useParsedDescription';
import { usePlayerContext } from '../../../Player/context';
import { StyledVideoDetail } from './styled-components/StyledVideoDetail';
import { Typography } from '@mui/material';


function VideoDetail({ size, activeItem, visible }) {
    const { playerState } = usePlayerContext();

    const parsedDescription = useParsedDescription(activeItem);

    return (
        <StyledVideoDetail
            className="scrollbar-hidden"
            isPlaying={playerState.isPlaying}
            size={size}
            visible={visible}
        >
            {parsedDescription.rest.map((part, index) => (
                <Typography
                    className="video-detail-part"
                    key={index}
                >
                    {part}
                </Typography>
            ))}
        </StyledVideoDetail>
    );
}

export default VideoDetail;
import { useParsedDescription } from '../../hooks/useParsedDescription';
import { StyledVideoDetail } from './styled-components/StyledVideoDetail';
import { Typography } from '@mui/material';
import { useApplicationContext } from '../../../../context';


function VideoDetail({ activeItem, visible }) {
    const { appState } = useApplicationContext();

    const parsedDescription = useParsedDescription(activeItem);

    return (
        <StyledVideoDetail
            className="scrollbar-hidden"
            size={appState.tileSize}
            visible={visible}
            hasVideoStarted={appState.hasVideoStarted}
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
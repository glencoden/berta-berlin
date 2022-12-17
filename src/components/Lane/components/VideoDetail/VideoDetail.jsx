import { useParsedDescription } from '../../hooks/useParsedDescription';
import { StyledVideoDetail } from './styled-components/StyledVideoDetail';
import Typography from '@mui/material/Typography';
import { useApplicationContext } from '../../../../context';

function parseURLs(string) {
    const urlRegex = /(https?:\/\/.[^\s]+)/g;
    const URLs = string.match(urlRegex);
    return URLs ||[];
}

function parseLinks(string) {
    const urls = parseURLs(string);
    let result = string;
    urls.forEach(url => {
        result = result.replace(url, `<a href='${url}' rel='noopener noreferrer' target='_blank'>${url}</a>`);
    });
    return result;
}

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
            {parsedDescription.rest.map((part, index) => {
                return (
                    <Typography
                        className="video-detail-part"
                        key={index}
                        dangerouslySetInnerHTML={{ __html: parseLinks(part) }}
                    />
                )
            })}
        </StyledVideoDetail>
    );
}

export default VideoDetail;
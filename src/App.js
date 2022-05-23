import { useEffect, useState } from 'react';
import { requestService } from './services/requestService';
import { PlayerProvider } from './components/Player/context';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/mui-theme';
import { editorService } from './services/editorService';
import Lane from './components/Lane/Lane';
import { ResourceType } from './enums/ResourceType';


function App() {
    const [ videos, setVideos ] = useState(null);
    const [ playlists, setPlaylists ] = useState(null);

    const [ resourceType, setResourceType ] = useState(ResourceType.VIDEO);
    const [ items, setItems ] = useState(null);

    useEffect(() => {
        if (videos !== null) {
            // TODO implement on page change
            const currentItems = editorService.getVideos(videos);
            setItems(currentItems);
            return;
        }
        requestService.getYoutubeApiCache(resourceType)
            .then(response => setVideos(response.videos));
    }, [ videos ]);

    return (
        <ThemeProvider theme={theme}>
            <PlayerProvider>
                <>
                    <div onClick={() => setItems(null)}>HIDE</div>
                    <div onClick={() => setItems(editorService.getVideos(videos))}>SHOW</div>

                    <Lane
                        items={items}
                        resourceType={resourceType}
                    />
                </>
            </PlayerProvider>
        </ThemeProvider>
    );
}

export default App;

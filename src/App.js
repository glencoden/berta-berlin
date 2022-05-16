import { useEffect, useState } from 'react';
import { requestService } from './services/requestService';
import { PlayerProvider } from './components/Player/context';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/mui-theme';
import Player from './components/Player/Player';
import VideoTile from './components/VideoTile/VideoTile';


function App() {
    const [videos, setVideos] = useState(null); // TODO extract this to editor service

    useEffect(() => {
        requestService.getVideos()
            .then(setVideos);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <PlayerProvider>
                <>
                    <VideoTile video={videos && videos[0]}/>
                    <Player/>
                </>
            </PlayerProvider>
        </ThemeProvider>
    );
}

export default App;

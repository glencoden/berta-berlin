import { useEffect, useState } from 'react';
import { requestService } from './services/requestService';
import { PlayerProvider } from './components/Player/context';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/mui-theme';
import Player from './components/Player/Player';
import VideoTile from './components/VideoTile/VideoTile';
import { editorService } from './services/editorService';


function App() {
    const [ videos, setVideos ] = useState(null);
    const [ currentVideoList, setCurrentVideoList ] = useState(null);

    useEffect(() => {
        // TODO implement on page change
        const currentList = editorService.getVideos(videos);
        setCurrentVideoList(currentList);

        if (videos !== null) {
            return;
        }
        requestService.getVideos()
            .then(setVideos);
    }, [ videos ]);

    console.log('currentVideoList', currentVideoList);

    return (
        <ThemeProvider theme={theme}>
            <PlayerProvider>
                <>
                    <VideoTile video={currentVideoList && currentVideoList[0]} width={1000}/>
                    <Player/>
                </>
            </PlayerProvider>
        </ThemeProvider>
    );
}

export default App;

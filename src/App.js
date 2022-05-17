import { useEffect, useState } from 'react';
import { requestService } from './services/requestService';
import { PlayerProvider } from './components/Player/context';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/mui-theme';
import { editorService } from './services/editorService';
import Lane from './components/Lane/Lane';
import { LaneItemType } from './components/Lane/enums/LaneItemType';


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

    return (
        <ThemeProvider theme={theme}>
            <PlayerProvider>
                <>
                    <div onClick={() => setCurrentVideoList(null)}>HIDE</div>
                    <div onClick={() => setCurrentVideoList(editorService.getVideos(videos))}>SHOW</div>

                    <Lane items={currentVideoList} type={LaneItemType.VIDEO} />
                </>
            </PlayerProvider>
        </ThemeProvider>
    );
}

export default App;

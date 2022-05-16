import { useEffect, useState } from 'react';
import { requestService } from './services/requestService';
import { PlayerProvider } from './components/Player/context';
import Player from './components/Player/Player';
import VideoTile from './components/VideoTile/VideoTile';


function App() {
    const [videos, setVideos] = useState(null); // TODO extract this to editor service

    useEffect(() => {
        requestService.getVideos()
            .then(setVideos);
    }, []);

    return (
        <PlayerProvider>
            <div>
                <div className="text-3xl font-bold text-center py-12">
                    glen was here - berta berlin
                </div>

                <VideoTile video={videos && videos[0]} />

                <Player />
            </div>
        </PlayerProvider>
    );
}

export default App;

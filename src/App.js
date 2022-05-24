import { useCallback, useEffect, useState } from 'react';
import { requestService } from './services/requestService';
import { PlayerProvider } from './components/Player/context';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/mui-theme';
import { editorService } from './services/editorService';
import Lane from './components/Lane/Lane';
import { ResourceType } from './enums/ResourceType';
import { QueryParamProvider } from 'use-query-params';
import Navigation from './components/Navigation/Navigation';
import { minDeviceWidth, tileSize } from './styles/variables';
import DeviceWall from './components/DeviceWall/DeviceWall';


function App() {
    const [ isDeviceLargeEnough, setIsDeviceLargeEnough ] = useState(window.innerWidth >= minDeviceWidth);
    const [ navigationOpen, setNavigationOpen ] = useState(false);

    const [ isVideosLoading, setIsVideosLoading ] = useState(true);
    const [ isPlaylistsLoading, setIsPlaylistsLoading ] = useState(true);

    const [ showVideoLane, setShowVideoLane ] = useState(false);

    /**
     * Get videos on mount
     */
    useEffect(() => {
        requestService.getYoutubeApiCache(ResourceType.VIDEO)
            .then(response => {
                editorService.setVideos(response.videos);
                setIsVideosLoading(false);
                setShowVideoLane(true);
                requestService.getYoutubeApiCache(ResourceType.PLAYLIST)
                    .then(response => {
                        editorService.setPlaylists(response.playlists);
                        setIsPlaylistsLoading(false);
                    })
            });

        const onResize = () => setIsDeviceLargeEnough(window.innerWidth >= minDeviceWidth);

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onToggleNavigationOpen = useCallback((open) => setNavigationOpen(open), []);

    const onSlideOutComplete = useCallback(() => {
        setShowVideoLane(true);
    }, []);

    const onMenuItemSelect = useCallback(() => {
        setShowVideoLane(false);

        setTimeout(onSlideOutComplete, 700); // TODO implement without safety timeout
    }, [ onSlideOutComplete ]);

    return (
        <ThemeProvider theme={theme}>
            <QueryParamProvider>
                <PlayerProvider>
                    {isDeviceLargeEnough ? (
                        <>
                            {!isPlaylistsLoading && (
                                <Navigation
                                    onMenuItemSelect={onMenuItemSelect}
                                    onToggleOpen={onToggleNavigationOpen}
                                />
                            )}
                            {!isVideosLoading && (
                                <Lane
                                    hide={!showVideoLane}
                                    size={tileSize}
                                    onSlideOutComplete={onSlideOutComplete}
                                    navigationOpen={navigationOpen}
                                />
                            )}
                        </>
                    ) : (
                        <DeviceWall />
                    )}
                </PlayerProvider>
            </QueryParamProvider>
        </ThemeProvider>
    );
}

export default App;

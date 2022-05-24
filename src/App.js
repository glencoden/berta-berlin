import { useCallback, useEffect, useState } from 'react';
import { requestService } from './services/requestService';
import { PlayerProvider } from './components/Player/context';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/mui-theme';
import { EditorFilterValues, editorService } from './services/editorService';
import Lane from './components/Lane/Lane';
import { ResourceType } from './enums/ResourceType';
import { QueryParamProvider } from 'use-query-params';
import Navigation from './components/Navigation/Navigation';
import { minDeviceWidth, tileSize } from './styles/variables';
import DeviceWall from './components/DeviceWall/DeviceWall';


function App() {
    const [ isDeviceLargeEnough, setIsDeviceLargeEnough ] = useState(window.innerWidth >= minDeviceWidth);
    const [ navigationOpen, setNavigationOpen ] = useState(false);

    const [ videos, setVideos ] = useState(null);
    // const [ playlists, setPlaylists ] = useState(null);

    const [ resourceType ] = useState(ResourceType.VIDEO);
    const [ items, setItems ] = useState(null);
    const [ showItems, setShowItems ] = useState(false);

    /**
     * Get videos on mount
     */
    useEffect(() => {
        requestService.getYoutubeApiCache(resourceType)
            .then(response => {
                setVideos(response.videos);
                setShowItems(true);
            });

        const onResize = () => setIsDeviceLargeEnough(window.innerWidth >= minDeviceWidth);
        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onToggleNavigationOpen = useCallback((open) => setNavigationOpen(open), []);

    const onSlideOutComplete = useCallback(() => {
        setShowItems(true);
    }, []);

    const onFilterChange = useCallback((filterValue) => {
        setShowItems(false);

        switch (filterValue) {
            case EditorFilterValues.TRENDING: {
                const currentItems = editorService.getVideos(videos);
                setItems(currentItems);
                break;
            }
            case EditorFilterValues.RECENT: {
                const currentItems = editorService.getVideos(videos);
                setItems(currentItems);
                break;
            }
            case EditorFilterValues.PLAYLISTS: {
                const currentItems = editorService.getVideos(videos);
                setItems(currentItems);
                break;
            }
            default:
        }

        setTimeout(onSlideOutComplete, 700); // TODO implement without safety timeout
    }, [ videos, onSlideOutComplete ]);

    return (
        <ThemeProvider theme={theme}>
            <QueryParamProvider>
                <PlayerProvider>
                    {isDeviceLargeEnough ? (
                        <>
                            <Navigation
                                onFilterChange={onFilterChange}
                                onToggleOpen={onToggleNavigationOpen}
                            />
                            <Lane
                                items={showItems ? items : null}
                                resourceType={resourceType}
                                size={tileSize}
                                onSlideOutComplete={onSlideOutComplete}
                                navigationOpen={navigationOpen}
                            />
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

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

const laneSize = { width: 1280, height: 720 };


function App() {
    const [ videos, setVideos ] = useState(null);
    // const [ playlists, setPlaylists ] = useState(null);

    const [ resourceType ] = useState(ResourceType.VIDEO);
    const [ items, setItems ] = useState(null);
    const [ showItems, setShowItems ] = useState(false);

    useEffect(() => {
        requestService.getYoutubeApiCache(resourceType)
            .then(response => {
                setVideos(response.videos);
                setShowItems(true);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ videos ]);

    const onSlideOutComplete = useCallback(() => {
        setShowItems(true);
    }, []);

    const onFilterChange = useCallback((filterValue) => {
        console.log('filterValue', filterValue)
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
                    <>
                        <Navigation onFilterChange={onFilterChange} />

                        <Lane
                            items={showItems ? items : null}
                            resourceType={resourceType}
                            size={laneSize}
                            onSlideOutComplete={onSlideOutComplete}
                        />
                    </>
                </PlayerProvider>
            </QueryParamProvider>
        </ThemeProvider>
    );
}

export default App;

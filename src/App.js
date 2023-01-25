import { useEffect, useState } from 'react';
import { requestService } from './services/requestService';
import { PlayerProvider } from './components/Player/context';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/mui-theme';
import { editorService } from './services/editorService';
import Lane from './components/Lane/Lane';
import { ResourceType } from './enums/ResourceType';
import { QueryParamProvider } from 'use-query-params';
import Navigation from './components/Navigation/Navigation';
import { minDeviceWidth } from './variables';
import LoadingMessage from './components/LoadingMessage/LoadingMessage';
import Headline from './components/Headline/Headline';
import { useApplicationContext } from './context';
import { ApplicationActionType } from './context/ApplicationActionType';
import { TransitionType } from './enums/TransitionType';


function App() {
    /**
     * Https redirect in production
     */
    if (process.env.NODE_ENV !== 'development') {
        const currentLocation = `${window.location.href}`;

        if (currentLocation.startsWith('http://')) {
            window.location.href = currentLocation.replace('http://', 'https://');
        }
    }

    const { appState, dispatch } = useApplicationContext();

    const [ isVideosLoading, setIsVideosLoading ] = useState(true);
    const [ isPlaylistsLoading, setIsPlaylistsLoading ] = useState(true);

    /**
     * Get videos on mount
     */
    useEffect(() => {
        if (dispatch === null) {
            return;
        }
        requestService.getYoutubeApiCache(ResourceType.VIDEO)
            .then(response => {
                editorService.setVideos(response.videos);
                setIsVideosLoading(false);
                dispatch({
                    type: ApplicationActionType.SET_CURRENT_TRANSITION,
                    payload: TransitionType.SLIDE_IN,
                });
                requestService.getYoutubeApiCache(ResourceType.PLAYLIST)
                    .then(response => {
                        editorService.setPlaylists(response.playlists);
                        setIsPlaylistsLoading(false);
                    });
            });

        let debounceTimeoutId;

        const onResize = () => {
            clearTimeout(debounceTimeoutId);
            debounceTimeoutId = setTimeout(() => {
                dispatch({ type: ApplicationActionType.CALC_TILE_SIZE });
                dispatch({ type: ApplicationActionType.CALC_IS_MOBILE });
                dispatch({ type: ApplicationActionType.CALC_IS_VIEWPORT_TOO_SMALL });
            }, 200);
        };

        const onOrientationChange = () => window.location.reload();

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onOrientationChange);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onOrientationChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ dispatch ]);

    return (
        <ThemeProvider theme={theme}>
            <QueryParamProvider>
                <PlayerProvider>
                    {appState.isViewPortTooSmall ? (
                        <LoadingMessage visible>
                            Please turn device or view on a larger screen<br/>(min width {minDeviceWidth}px)
                        </LoadingMessage>
                    ) : (
                        <>
                            <LoadingMessage visible={isPlaylistsLoading}>
                                <Headline/>
                            </LoadingMessage>

                            {!isPlaylistsLoading && (
                                <Navigation/>
                            )}

                            {!isVideosLoading && (
                                <Lane isPlaylistsLoading={isPlaylistsLoading} />
                            )}
                        </>
                    )}
                </PlayerProvider>
            </QueryParamProvider>
        </ThemeProvider>
    );
}

export default App;

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
import { minDeviceWidth } from './styles/variables';
import LoadingMessage from './components/LoadingMessage/LoadingMessage';
import Headline from './components/Headline/Headline';
import { useApplicationContext } from './context';
import { ApplicationActionType } from './context/ApplicationActionType';


function App() {
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
        setTimeout(() => {
            requestService.getYoutubeApiCache(ResourceType.VIDEO)
                .then(response => {
                    editorService.setVideos(response.videos);
                    setIsVideosLoading(false);
                    requestService.getYoutubeApiCache(ResourceType.PLAYLIST)
                        .then(response => {
                            editorService.setPlaylists(response.playlists);
                            setIsPlaylistsLoading(false);
                        });
                });
        }, 3000);

        const onResize = () => {
            dispatch({ type: ApplicationActionType.CALC_IS_MOBILE });
            dispatch({ type: ApplicationActionType.CALC_IS_VIEWPORT_TOO_SMALL });
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
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
                                <Lane/>
                            )}
                        </>
                    )}
                </PlayerProvider>
            </QueryParamProvider>
        </ThemeProvider>
    );
}

export default App;

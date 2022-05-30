import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyledLane } from './styled-components/StyledLane';
import Player from '../Player/Player';
import PlayerOverlay from './components/PlayerOverlay/PlayerOverlay';
import { mapItemToTile } from './helpers/mapItemToTile';
import { laneTileAnimationOffset, laneTileOffset } from '../../styles/variables';
import Image from '../Image/Image';
import Tile from './components/Tile/Tile';
import VideoDetail from './components/VideoDetail/VideoDetail';
import TileSwitch from './components/TileSwitch/TileSwitch';
import { editorService } from '../../services/editorService';
import { useApplicationContext } from '../../context';
import { ApplicationActionType } from '../../context/ApplicationActionType';
import { TransitionType } from '../../enums/TransitionType';


function Lane() {
    const { appState, dispatch } = useApplicationContext();

    const [ items, setItems ] = useState(null);
    const [ activeIndex, setActiveIndex ] = useState(0);

    const visibleTilesCount = useRef(0);
    const numTilesWhichShouldShow = useRef(0);

    const onSelectPrev = useCallback(() => {
        if (appState.currentTransition !== TransitionType.NONE) {
            return;
        }
        numTilesWhichShouldShow.current++;
        setActiveIndex(prevIndex => Math.max(prevIndex - 1, 0));
    }, [ appState.currentTransition ]);

    const onSelectNext = useCallback(() => {
        if (appState.currentTransition !== TransitionType.NONE) {
            return;
        }
        numTilesWhichShouldShow.current--;
        setActiveIndex(prevIndex => Math.min(prevIndex + 1, items?.length - 1));
    }, [ appState.currentTransition, items ]);

    const activeItem = items?.[activeIndex];
    const tiles = items?.map(mapItemToTile);

    /**
     * Set and reset local state
     */
    useEffect(() => {
        if (appState.selectedConfig === null) {
            return;
        }
        switch (appState.currentTransition) {
            case TransitionType.NONE:
                break;
            case TransitionType.SLIDE_OUT:
                numTilesWhichShouldShow.current = 0;
                setActiveIndex(0);
                break;
            case TransitionType.SLIDE_IN:
                const updatedItems = editorService.getVideos(appState.selectedConfig);
                numTilesWhichShouldShow.current = updatedItems.length;
                setItems(updatedItems);
                break;
            default:
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ appState.selectedConfig, appState.currentTransition ]);

    /**
     * Arrow key navigation
     */
    useEffect(() => {
        const onKeydown = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    onSelectPrev();
                    break;
                case 'ArrowRight':
                    onSelectNext();
                    break;
                default:
            }
        };

        window.addEventListener('keydown', onKeydown);

        return () => window.removeEventListener('keydown', onKeydown);
    }, [ onSelectPrev, onSelectNext ]);

    /**
     * This intersection observer compares the num of tiles that should be visible with the ones it counted entering the screen to determine transition end
     */
    const tileObserver = useMemo(() => {
        if (!IntersectionObserver) {
            return null;
        }
        return new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting && visibleTilesCount.current === 0) {
                        return;
                    }
                    visibleTilesCount.current = entry.isIntersecting
                        ? visibleTilesCount.current + 1
                        : Math.max(visibleTilesCount.current - 1, 0);

                    if (visibleTilesCount.current !== numTilesWhichShouldShow.current) {
                        return;
                    }
                    if (visibleTilesCount.current === 0) {
                        dispatch({
                            type: ApplicationActionType.SET_CURRENT_TRANSITION,
                            payload: TransitionType.SLIDE_IN,
                        });
                        return;
                    }
                    dispatch({
                        type: ApplicationActionType.SET_CURRENT_TRANSITION,
                        payload: TransitionType.NONE,
                    });
                });
            },
            {
                rootMargin: '0px',
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showTiles = appState.currentTransition !== TransitionType.SLIDE_OUT;
    const showControls = appState.currentTransition === TransitionType.NONE;

    return (
        <StyledLane
            size={appState.tileSize}
            numTiles={tiles?.length}
            isMenuOpen={appState.isMenuOpen}
        >
            <TileSwitch
                onPrev={onSelectPrev}
                onNext={onSelectNext}
                numTiles={tiles?.length}
                activeIndex={activeIndex}
                visible={showControls}
            />

            {tiles?.map((tile, index) => {
                const displayIndex = index - activeIndex;
                const hideTile = !showTiles || displayIndex < 0;
                const transform = displayIndex * laneTileOffset;
                const zIndex = tiles.length - displayIndex;
                const delay = (hideTile ? displayIndex : (tiles.length - 1 - index)) * laneTileAnimationOffset;
                return (
                    <Tile
                        key={`${tile.title}${index}`}
                        hide={hideTile}
                        transform={transform}
                        zIndex={zIndex}
                        delay={delay}
                        setActive={() => setActiveIndex(index)}
                        observer={tileObserver}
                    >
                        <Image
                            url={tile.url}
                            width={appState.tileSize.width}
                            height={appState.tileSize.height}
                            title={tile.title}
                        />
                    </Tile>
                );
            })}

            <VideoDetail
                className="lane-video-detail"
                activeItem={activeItem}
                visible={showControls}
            />

            <Player
                className="lane-player"
                hasVideoStarted={appState.hasVideoStarted}
            />

            <PlayerOverlay
                className="lane-player-overlay"
                activeItem={activeItem}
                visible={showControls}
            />
        </StyledLane>
    );
}

export default Lane;
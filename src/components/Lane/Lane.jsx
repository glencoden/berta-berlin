import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyledLane } from './styled-components/StyledLane';
import Player from '../Player/Player';
import PlayerOverlay from './components/PlayerOverlay/PlayerOverlay';
import { mapItemToTile } from './helpers/mapItemToTile';
import { laneTileAnimationOffset, laneTileOffset } from '../../variables';
import Image from '../Image/Image';
import Tile from './components/Tile/Tile';
import VideoDetail from './components/VideoDetail/VideoDetail';
import TileSwitch from './components/TileSwitch/TileSwitch';
import { editorService } from '../../services/editorService';
import { useApplicationContext } from '../../context';
import { ApplicationActionType } from '../../context/ApplicationActionType';
import { TransitionType } from '../../enums/TransitionType';
import TileSwitchMobile from './components/TileSwitch/TileSwitchMobile';
import { getNumRenderedTiles } from './helpers/getNumRenderedTiles';

const TilePosition = {
    INTERMEDIATE: 'intermediate',
    FIRST: 'first',
    LAST: 'last',
};


function Lane({ isPlaylistsLoading }) {
    const { appState, dispatch } = useApplicationContext();

    const [ items, setItems ] = useState(null);
    const [ activeIndex, setActiveIndex ] = useState(0);

    const onSelectPrev = useCallback(() => {
        if (appState.currentTransition !== TransitionType.NONE) {
            return;
        }
        // numTilesWhichShouldShow.current++;
        setActiveIndex(prevIndex => Math.max(prevIndex - 1, 0));
    }, [ appState.currentTransition ]);

    const onSelectNext = useCallback(() => {
        if (appState.currentTransition !== TransitionType.NONE) {
            return;
        }
        // numTilesWhichShouldShow.current--;
        setActiveIndex(prevIndex => Math.min(prevIndex + 1, items?.length - 1));
    }, [ appState.currentTransition, items ]);

    const activeItem = items?.[activeIndex];

    const tiles = items
        ?.slice(0, activeIndex + getNumRenderedTiles(appState.tileSize))
        .map(mapItemToTile);

    const transitionTypeRef = useRef(appState.currentTransition);
    const isEmptyListRef = useRef(false);

    /**
     * Set and reset local state
     */
    useEffect(() => {
        if (appState.selectedConfig === null) {
            return;
        }
        transitionTypeRef.current = appState.currentTransition;

        switch (appState.currentTransition) {
            case TransitionType.NONE:
                break;
            case TransitionType.SLIDE_OUT:
                if (isEmptyListRef.current) {
                    dispatch({
                        type: ApplicationActionType.SET_CURRENT_TRANSITION,
                        payload: TransitionType.SLIDE_IN,
                    });
                }
                break;
            case TransitionType.SLIDE_IN:
                setActiveIndex(0);

                const updatedItems = editorService.getVideos(appState.selectedConfig);

                isEmptyListRef.current = updatedItems.length === 0;

                setItems(updatedItems.length === 0 ? null : updatedItems);
                break;
            case TransitionType.INSERT:
                const insertVideo = editorService.getInsertVideo();

                setItems(prevItems => {
                    // if there is no insert return unchanged list
                    if (insertVideo === null) {
                        return prevItems;
                    }
                    // if there is no current list, add list with inserted item
                    if (prevItems === null) {
                        return [insertVideo];
                    }
                    const currentItemList = [...prevItems];
                    const insertVideoIndex = currentItemList.findIndex(item => item.id === insertVideo.id);
                    // if insert is part of current list, remove it
                    if (insertVideoIndex > -1) {
                        currentItemList.splice(insertVideoIndex, 1);
                    }
                    // add insert on top and move to top tile
                    setActiveIndex(0);
                    return [insertVideo, ...currentItemList];
                });
                // reset transition state on next stack to enable slide in animation of insert video
                setTimeout(() => {
                    dispatch({
                        type: ApplicationActionType.SET_CURRENT_TRANSITION,
                        payload: TransitionType.NONE,
                    });
                }, 0);
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
                    if (
                        entry.isIntersecting
                        && entry.target.dataset.position === TilePosition.FIRST
                        && transitionTypeRef.current === TransitionType.SLIDE_IN
                    ) {
                        dispatch({
                            type: ApplicationActionType.SET_CURRENT_TRANSITION,
                            payload: TransitionType.NONE,
                        });
                        dispatch({
                            type: ApplicationActionType.SET_HAS_LOADED,
                            payload: true,
                        });
                    } else if (
                        !entry.isIntersecting
                        && entry.target.dataset.position === TilePosition.LAST
                        && transitionTypeRef.current === TransitionType.SLIDE_OUT
                    ) {
                        dispatch({
                            type: ApplicationActionType.SET_CURRENT_TRANSITION,
                            payload: TransitionType.SLIDE_IN,
                        });
                    }
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
        <>
            {appState.isMobile && (
                <TileSwitchMobile
                    onPrev={onSelectPrev}
                    onNext={onSelectNext}
                    numTiles={tiles?.length}
                />
            )}
            <StyledLane
                size={appState.tileSize}
                numTiles={tiles?.length}
                isMenuOpen={appState.isMenuOpen}
                hasLoaded={!isPlaylistsLoading}
            >
                {!appState.isMobile && (
                    <TileSwitch
                        onPrev={onSelectPrev}
                        onNext={onSelectNext}
                        numTiles={items?.length}
                        activeIndex={activeIndex}
                        visible={showControls}
                    />
                )}

                {tiles?.map((tile, index) => {
                    const displayIndex = index - activeIndex;
                    const hideTile = !showTiles || displayIndex < 0;
                    const position = index === 0 ? TilePosition.FIRST : index === tiles.length - 1 ? TilePosition.LAST : TilePosition.INTERMEDIATE;
                    const transform = displayIndex * laneTileOffset;
                    const zIndex = tiles.length - displayIndex;
                    const delay = (hideTile ? displayIndex : (tiles.length - 1 - index)) * laneTileAnimationOffset;
                    return (
                        <Tile
                            key={tile.key}
                            hide={hideTile}
                            position={position}
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
        </>

    );
}

export default Lane;
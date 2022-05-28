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


function Lane() {
    const { appState } = useApplicationContext();

    const [ currentLaneConfig, setCurrentLaneConfig ] = useState(appState.selectedConfig);

    const [ items, setItems ] = useState(null);
    const [ activeIndex, setActiveIndex ] = useState(0);

    const [ showLane, setShowLane ] = useState(true);
    const [ doneTransitioning, setDoneTransitioning ] = useState(false);

    const visibleTilesCount = useRef(0);
    const numTilesWhichShouldShow = useRef(0);

    const onSelectPrev = useCallback(() => {
        if (!doneTransitioning) {
            return;
        }
        numTilesWhichShouldShow.current++;
        setActiveIndex(prevIndex => Math.max(prevIndex - 1, 0));
    }, [ doneTransitioning ]);

    const onSelectNext = useCallback(() => {
        if (!doneTransitioning) {
            return;
        }
        numTilesWhichShouldShow.current--;
        setActiveIndex(prevIndex => Math.min(prevIndex + 1, items?.length - 1));
    }, [ doneTransitioning, items ]);

    const activeItem = items?.[activeIndex];
    const tiles = items?.map(mapItemToTile);

    /**
     * Set and reset local state
     */
    useEffect(() => {
        if (appState.selectedConfig === null) {
            return;
        }
        if (appState.selectedConfig !== currentLaneConfig) {
            if (currentLaneConfig === null) {
                setCurrentLaneConfig(appState.selectedConfig);
                return;
            }
            numTilesWhichShouldShow.current = 0;
            setActiveIndex(0);
            setShowLane(false);
            setDoneTransitioning(false);
            return;
        }
        const updatedItems = editorService.getVideos(currentLaneConfig);
        numTilesWhichShouldShow.current = updatedItems.length;
        setItems(updatedItems);
    }, [ appState.selectedConfig, currentLaneConfig ]);

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
                        setShowLane(true);
                        setDoneTransitioning(false);
                        return;
                    }
                    setDoneTransitioning(true);
                });
            },
            {
                rootMargin: '0px',
            },
        );
    }, []);

    const showControls = showLane && doneTransitioning;

    return (
        <StyledLane
            size={appState.size}
            numTiles={tiles?.length}
            isMenuOpen={appState.isMenuOpen}
        >
            <TileSwitch
                size={appState.size}
                onPrev={onSelectPrev}
                onNext={onSelectNext}
                numTiles={tiles?.length}
                activeIndex={activeIndex}
                visible={showControls}
            />

            {tiles?.map((tile, index) => {
                const displayIndex = index - activeIndex;
                const hideTile = !showLane || displayIndex < 0;
                const transform = displayIndex * laneTileOffset;
                const zIndex = tiles.length - displayIndex;
                const delay = (hideTile ? displayIndex : (tiles.length - 1 - index)) * laneTileAnimationOffset;
                return (
                    <Tile
                        key={`${tile.title}${index}`}
                        hide={hideTile}
                        transform={transform}
                        zIndex={zIndex}
                        size={appState.size}
                        delay={delay}
                        setActive={() => setActiveIndex(index)}
                        observer={tileObserver}
                    >
                        <Image
                            url={tile.url}
                            width={appState.size.width}
                            height={appState.size.height}
                            title={tile.title}
                        />
                    </Tile>
                );
            })}

            <VideoDetail
                className="lane-video-detail"
                size={appState.size}
                activeItem={activeItem}
                visible={showControls}
            />

            <Player className="lane-player"/>

            <PlayerOverlay
                className="lane-player-overlay"
                size={appState.size}
                activeItem={activeItem}
                visible={showControls}
            />
        </StyledLane>
    );
}

export default Lane;
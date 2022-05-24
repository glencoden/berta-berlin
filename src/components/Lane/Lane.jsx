import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyledLane } from './styled-components/StyledLane';
import Player from '../Player/Player';
import Controls from './components/Controls/Controls';
import { mapItemToTile } from './helpers/mapItemToTile';
import { laneTileAnimationOffset, laneTileOffset } from '../../styles/variables';
import Image from '../Image/Image';
import Tile from './components/Tile/Tile';
import VideoDetail from './components/VideoDetail/VideoDetail';
import Switch from './components/Switch/Switch';
import { editorService } from '../../services/editorService';


function Lane({ hide, size, onSlideOutComplete, navigationOpen }) {
    const [ items, setItems ] = useState(null);
    const [ tiles, setTiles ] = useState(null);
    const [ doneTransitioning, setDoneTransitioning ] = useState(false);
    const [ activeIndex, setActiveIndex ] = useState(0);

    const onSelectPrev = useCallback(() => setActiveIndex(prevIndex => Math.max(prevIndex - 1, 0)), []);
    const onSelectNext = useCallback(() => setActiveIndex(prevIndex => Math.min(prevIndex + 1, items?.length - 1)), [ items ]);

    const activeItem = items?.[activeIndex];

    /**
     * Set items on hide undone
     */
    useEffect(() => {
        if (hide) {
            return;
        }
        setItems(() => editorService.getVideos());
    }, [ hide ]);

    /**
     * Create tiles from items
     */
    useEffect(() => {
        if (items === null) {
            return;
        }
        const tiles = items.map(mapItemToTile);
        setTiles(tiles);
    }, [ items ]);

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
     * Set num tiles that should show for intersection observer to determine transition end
     */
    useEffect(() => {
        if (items === null) {
            numTilesWhichShouldShow.current = 0;
            setDoneTransitioning(false);
            return;
        }
        numTilesWhichShouldShow.current = items.length - activeIndex;
    }, [ items, activeIndex ]);

    /**
     * This intersection observer compares the num of tiles that should be visible with the ones it counted entering the screen to determine transition end
     */
    const visibleTilesCount = useRef(0);
    const numTilesWhichShouldShow = useRef(0);

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

                    if (visibleTilesCount.current === numTilesWhichShouldShow.current) {
                        if (visibleTilesCount.current === 0) {
                            onSlideOutComplete();
                            setDoneTransitioning(false);
                            return;
                        }
                        setDoneTransitioning(true);
                        return;
                    }
                    setDoneTransitioning(false);
                });
            },
            {
                rootMargin: '0px',
            },
        );
    }, [ onSlideOutComplete ]);

    const showControls = !hide && doneTransitioning;

    return (
        <StyledLane
            size={size}
            numTiles={tiles?.length}
            navigationOpen={navigationOpen}
        >
            <Switch
                size={size}
                onPrev={onSelectPrev}
                onNext={onSelectNext}
                numTiles={tiles?.length}
                activeIndex={activeIndex}
            />

            {tiles?.map((tile, index) => {
                const displayIndex = index - activeIndex;
                const hideTile = hide || displayIndex < 0;
                const transform = displayIndex * laneTileOffset;
                const zIndex = tiles.length - displayIndex;
                const delay = (hideTile ? displayIndex : (tiles.length - 1 - index)) * laneTileAnimationOffset;
                return (
                    <Tile
                        key={tile.title + index}
                        hide={hideTile}
                        transform={transform}
                        zIndex={zIndex}
                        size={size}
                        delay={delay}
                        observer={tileObserver}
                    >
                        <Image
                            url={tile.url}
                            width={size.width}
                            height={size.height}
                            title={tile.title}
                        />
                    </Tile>
                );
            })}

            <VideoDetail
                className="lane-video-detail"
                size={size}
                activeItem={activeItem}
                showControls={showControls}
            />

            <Player className="lane-player"/>

            <Controls
                className="lane-controls"
                size={size}
                activeItem={activeItem}
                showControls={showControls}
            />
        </StyledLane>
    );
}

export default Lane;
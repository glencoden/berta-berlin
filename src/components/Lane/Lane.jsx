import { useEffect, useMemo, useRef, useState } from 'react';
import { StyledLane } from './styled-components/StyledLane';
import Player from '../Player/Player';
import Controls from './components/Controls/Controls';
import { mapItemToTile } from './helpers/mapItemToTile';
import { laneTileAnimationOffset, laneTileOffset } from '../../styles/variables';
import Image from '../Image/Image';
import Tile from './components/Tile/Tile';
import VideoDetail from './components/VideoDetail/VideoDetail';


function Lane({ items, resourceType, size, onSlideOutComplete }) {
    const [ tiles, setTiles ] = useState(null);
    const [ doneTransitioning, setDoneTransitioning ] = useState(false);
    const [ activeIndex, setActiveIndex ] = useState(0);

    const activeItem = items?.[activeIndex];

    /**
     * Create tiles from items
     */
    useEffect(() => {
        if (!items) {
            return;
        }
        const tiles = items.map(mapItemToTile);
        setTiles(tiles);
    }, [ items ]);

    /**
     * Arrow key navigation
     */
    useEffect(() => {
        if (!items) {
            return;
        }
        const onKeydown = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    setActiveIndex(prevIndex => Math.max(prevIndex - 1, 0));
                    break;
                case 'ArrowRight':
                    setActiveIndex(prevIndex => Math.min(prevIndex + 1, items.length - 1));
                    break;
                default:
            }
        };

        window.addEventListener('keydown', onKeydown);

        return () => window.removeEventListener('keydown', onKeydown);
    }, [ items ]);

    /**
     * Set num tiles that should show for intersection observer to determine transition end
     */
    useEffect(() => {
        if (!items) {
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

    const showControls = !!items && doneTransitioning;

    return (
        <StyledLane
            size={size}
            numTiles={tiles?.length}
        >
            {tiles?.map((tile, index) => {
                const displayIndex = index - activeIndex;
                const hide = !items || displayIndex < 0;
                const transform = displayIndex * laneTileOffset;
                const zIndex = tiles.length - displayIndex;
                const delay = (hide ? displayIndex : (tiles.length - 1 - index)) * laneTileAnimationOffset;
                return (
                    <Tile
                        key={tile.title + index}
                        hide={hide}
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
                resourceType={resourceType}
                showControls={showControls}
            />
        </StyledLane>
    );
}

export default Lane;
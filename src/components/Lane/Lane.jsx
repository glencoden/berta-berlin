import { useEffect, useState } from 'react';
import { StyledLane } from './styled-components/StyledLane';
import Player from '../Player/Player';
import Controls from './components/Controls/Controls';
import { mapItemToTile } from './helpers/mapItemToTile';
import { laneTileHideClass, laneTileOffset } from '../../styles/variables';
import { getHideTileOffset } from './helpers/getHideTileOffset';
import { StyledTile } from './styled-components/StyledTile';
import Image from '../Image/Image';


function Lane({ items, type, onSlideOutComplete }) {
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ tiles, setTiles ] = useState(null);
    const [ showTiles, setShowTiles ] = useState(false);
    const [ size ] = useState({ width: 1280, height: 720 });

    const activeItem = items?.[activeIndex];

    useEffect(() => {
        if (!items) {
            return;
        }
        const tiles = items.map(mapItemToTile);
        setTiles(tiles);
    }, [ items ]);

    useEffect(() => {
        if (!tiles) {
            setShowTiles(false);
            return;
        }
        setTimeout(() => setShowTiles(true), 100); // TODO fix race condition or solve slide in/out better alltogether
    }, [ tiles ]);

    const onTransitionEnd = () => {
        if (Array.isArray(items)) {
            return;
        }
        if (typeof onSlideOutComplete === 'function') {
            onSlideOutComplete();
        }
        setTiles(null);
    };

    return (
        <StyledLane size={size} onTransitionEnd={onTransitionEnd}>
            <Player/>

            {tiles?.map((tile, index) => {
                const displayIndex = index - activeIndex;
                const hide = !items || displayIndex < 0;
                const transform = hide ? -(getHideTileOffset(size.width)) : displayIndex * laneTileOffset;
                const zIndex = tiles?.length - index;
                return (
                    <StyledTile
                        className={!showTiles && laneTileHideClass}
                        transform={transform}
                        zIndex={zIndex}
                        size={size}
                    >
                        <Image
                            url={tile.url}
                            width={size.width}
                            height={size.height}
                            title={tile.title}
                        />
                    </StyledTile>
                );
            })}

            <Controls item={activeItem} type={type}/>

            {items && (
                <>
                    <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '-70px',
                        backgroundColor: 'lime',
                        padding: '20px',
                    }}
                         onClick={activeIndex < items.length ? () => setActiveIndex(Math.max(activeIndex - 1, 0)) : undefined}>DOWN
                    </div>
                    <div style={{
                        position: 'absolute',
                        left: '100px',
                        top: '-70px',
                        backgroundColor: 'blue',
                        padding: '20px',
                    }}
                         onClick={activeIndex < items.length ? () => setActiveIndex(Math.min(activeIndex + 1, items.length - 1)) : undefined}>UP
                    </div>
                </>
            )}
        </StyledLane>
    );
}

export default Lane;
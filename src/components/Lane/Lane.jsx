import { useEffect, useRef, useState } from 'react';
import { StyledLane } from './styled-components/StyledLane';
import Player from '../Player/Player';
import Controls from './components/Controls/Controls';
import { mapItemToTile } from './helpers/mapItemToTile';
import { laneTileAnimationOffset, laneTileOffset } from '../../styles/variables';
import Image from '../Image/Image';
import Tile from './components/Tile/Tile';

// TODO implement onSlideOutComplete

function Lane({ items, type, onSlideOutComplete }) {
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ tiles, setTiles ] = useState(null);
    const [ size ] = useState({ width: 1280, height: 720 });

    const numItemsRef = useRef(0);

    const activeItem = items?.[activeIndex];

    useEffect(() => {
        if (!items) {
            return;
        }
        numItemsRef.current = items.length;
        const tiles = items.map(mapItemToTile);
        setTiles(tiles);
    }, [ items ]);

    return (
        <StyledLane size={size}>
            <Player/>

            {tiles?.map((tile, index) => {
                const displayIndex = index - activeIndex;
                const hide = !items || displayIndex < 0;
                const transform = displayIndex * laneTileOffset;
                const zIndex = tiles?.length - index;
                const delay = (hide ? displayIndex : (tiles.length - 1 - index)) * laneTileAnimationOffset;
                return (
                    <Tile
                        key={tile.title + index}
                        hide={hide}
                        transform={transform}
                        zIndex={zIndex}
                        size={size}
                        delay={delay}
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
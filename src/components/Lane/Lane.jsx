import { useEffect, useState } from 'react';
import { StyledLane } from './styled-components/StyledLane';
import Player from '../Player/Player';
import Controls from './components/Controls/Controls';
import Tile from './components/Tile/Tile';
import { mapItemToTile } from './helpers/mapItemToTile';


function Lane({ items, type }) {
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ tiles, setTiles ] = useState(null);
    const [ size ] = useState({ width: 1280, height: 720 });

    const activeItem = items?.[activeIndex];

    useEffect(() => {
        if (!items) {
            return;
        }
        const tiles = items.map(mapItemToTile);
        setTiles(tiles);
    }, [ items ]);

    if (!items) {
        return null;
    }

    const laneOffset = Math.max(items.length - 1, 0);
    const correction = (activeIndex === 0 || activeIndex === items.length) ? 0 : activeIndex;

    return (
        <StyledLane
            offset={laneOffset - correction}
            size={size}
        >
            {tiles?.reverse().map((tile, reverseIndex) => (
                <Tile
                    key={tile.title}
                    reverseIndex={reverseIndex}
                    activeIndex={activeIndex}
                    numTiles={tiles?.length || 0}
                    url={tile.url}
                    size={size}
                    title={tile.title}
                />
            ))}

            <Player/>

            <Controls item={activeItem} type={type}/>

            <div style={{ position: 'absolute', left: '20px', top: '-50px' }} onClick={activeIndex < items.length ? () => setActiveIndex(Math.max(activeIndex - 1, 0)) : undefined}>DOWN</div>
            <div style={{ position: 'absolute', left: '100px', top: '-50px' }} onClick={activeIndex < items.length ? () => setActiveIndex(Math.min(activeIndex + 1, items.length - 1)) : undefined}>UP</div>
            <div style={{ position: 'absolute', left: '180px', top: '-50px' }} onClick={() => setActiveIndex(items.length)}>OUT</div>
            <div style={{ position: 'absolute', left: '240px', top: '-50px' }} onClick={() => setActiveIndex(0)}>IN</div>
        </StyledLane>
    );
}

export default Lane;
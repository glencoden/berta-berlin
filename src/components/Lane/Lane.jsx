import { useEffect, useState } from 'react';
import { StyledLane } from './styled-components/StyledLane';
import Player from '../Player/Player';
import Controls from './components/Controls/Controls';
import Tile from './components/Tile/Tile';
import { mapItemToTile } from './helpers/mapItemToTile';


function Lane({ items, type }) {
    const [ activeIndex ] = useState(0);
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

    return (
        <StyledLane numItems={items.length} size={size}>
            {tiles?.map((tile, index) => (
                <Tile
                    key={tile.title}
                    index={index}
                    url={tile.url}
                    size={size}
                    title={tile.title}
                />
            ))}

            <Player/>

            <Controls item={activeItem} type={type}/>
        </StyledLane>
    );
}

export default Lane;
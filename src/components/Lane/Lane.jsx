import { useEffect, useRef, useState } from 'react';
import { StyledLane } from './styled-components/StyledLane';
import Player from '../Player/Player';
import Controls from './components/Controls/Controls';
import { mapItemToTile } from './helpers/mapItemToTile';
import { laneTileAnimationOffset, laneTileOffset } from '../../styles/variables';
import Image from '../Image/Image';
import Tile from './components/Tile/Tile';
import { ResourceType } from '../../enums/ResourceType';
import { PlayerActionType } from '../Player/context/PlayerActionType';
import { usePlayerContext } from '../Player/context';

// TODO implement onSlideOutComplete

function Lane({ items, type, onSlideOutComplete }) {
    const { playerState, dispatch } = usePlayerContext();

    const [ size ] = useState({ width: 1280, height: 720 });
    const [ tiles, setTiles ] = useState(null);
    const [ activeIndex, setActiveIndex ] = useState(0);

    const activeItem = items?.[activeIndex];

    useEffect(() => {
        if (!items) {
            return;
        }
        const tiles = items.map(mapItemToTile);
        setTiles(tiles);
    }, [ items ]);

    useEffect(() => {
        dispatch({
            type: PlayerActionType.SET_SIZE,
            payload: size,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ size ]);

    const onPlay = () => {
        if (!activeItem) {
            return;
        }
        switch (type) {
            case ResourceType.VIDEO:
                dispatch({
                    type: PlayerActionType.SET_VIDEO,
                    payload: activeItem,
                });
                break;
            case ResourceType.PLAYLIST:
                dispatch({
                    type: PlayerActionType.SET_PLAYLIST,
                    payload: activeItem,
                });
                break;
            default:
        }
    };

    return (
        <StyledLane size={size}>
            <Player zIndex={tiles ? tiles.length * 10 - 5 : -1} />

            {tiles?.map((tile, index) => {
                const displayIndex = index - activeIndex;
                const hide = !items || displayIndex < 0;
                const transform = displayIndex * laneTileOffset;
                const zIndex = (tiles.length - displayIndex) * 10;
                const delay = (hide ? displayIndex : (tiles.length - 1 - index)) * laneTileAnimationOffset;
                return (
                    <Tile
                        key={tile.title + index}
                        hide={hide}
                        isPlaying={playerState.isPlaying && displayIndex === 0}
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
                        <Controls
                            size={size}
                            tile={tile}
                            onPlay={onPlay}
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
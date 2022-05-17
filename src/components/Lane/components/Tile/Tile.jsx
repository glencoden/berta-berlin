import { StyledTile } from './styled-components/StyledTile';
import Image from '../../../Image/Image';
import { useEffect, useState } from 'react';
import { showTileClassname, tileAnimationDelayUnit } from '../../../../styles/variables';


function Tile({ reverseIndex, activeIndex, numTiles, url, size, title }) {
    const reverseActiveIndex = numTiles - activeIndex;
    const visible = reverseIndex < reverseActiveIndex;

    const [ showTile, setShowTile ] = useState(false);
    const [ prevReverseActiveIndex, setPrevReverseActiveIndex ] = useState(0); // smallest reverse active index of a tile is 1, so 0 means active index = numTiles
    const [ animationDelay, setAnimationDelay ] = useState(0);

    useEffect(() => {
        const delayFactor = Math.abs(reverseIndex - prevReverseActiveIndex) - 1;
        const extraDelay = prevReverseActiveIndex === 0 ? 1 : 0;
        const animationDelay = (delayFactor * tileAnimationDelayUnit / 1000) + extraDelay;

        setAnimationDelay(animationDelay);
        setPrevReverseActiveIndex(reverseActiveIndex);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ reverseActiveIndex ]);

    const onAnimationEnd = ({ target }) => {
        target.classList.toggle(showTileClassname, visible);
        setShowTile(visible);
    };

    return (
        <StyledTile
            index={reverseIndex}
            visible={visible}
            size={size}
            animationDelay={animationDelay}
            className={showTile && showTileClassname}
            onAnimationEnd={onAnimationEnd}
        >
            <Image
                url={url}
                width={size.width}
                height={size.height}
                title={title}
            />
        </StyledTile>
    );
}

export default Tile;
import { useEffect, useRef, useState } from 'react';
import { StyledTile } from './styled-components/StyledTile';
import { laneLeft, laneTileSlideInDelay } from '../../../../styles/variables';

const HIDE_OFFSET_SAFETY_MARGIN = 50;


function Tile({ hide, transform, zIndex, size, delay, children }) {
    const [ showTile, setShowTile ] = useState(false);
    const [ delayOnMount, setDelayOnMount ] = useState(delay + laneTileSlideInDelay);

    const timeoutIdRef = useRef(0);

    useEffect(() => {
        timeoutIdRef.current = hide
            ? setTimeout(() => setShowTile(false), delay)
            : setTimeout(() => setShowTile(true), delayOnMount);
        return () => {
            clearTimeout(timeoutIdRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ hide ]);

    useEffect(() => setDelayOnMount(0), []);

    return (
        <StyledTile
            transform={showTile ? transform : -(size.width + laneLeft + HIDE_OFFSET_SAFETY_MARGIN)}
            zIndex={zIndex}
            size={size}
        >
            {children}
        </StyledTile>
    );
}

export default Tile;
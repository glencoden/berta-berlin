import { useEffect, useRef, useState } from 'react';
import { StyledTile } from './styled-components/StyledTile';
import { laneLeft, laneTileSlideInDelay } from '../../../../styles/variables';

const HIDE_OFFSET_SAFETY_MARGIN = 50;


function Tile({ hide, transform, zIndex, size, delay, observer, children }) {
    const [ showTile, setShowTile ] = useState(false);
    const [ delayOnMount, setDelayOnMount ] = useState(delay + laneTileSlideInDelay);

    const timeoutIdRef = useRef(0);
    const tileElement = useRef(null);

    /**
     * Set show tile delay to 0 for mount
     */
    useEffect(() => setDelayOnMount(0), []);

    /**
     * Time tile hide and show
     */
    useEffect(() => {
        timeoutIdRef.current = hide
            ? setTimeout(() => setShowTile(false), delay)
            : setTimeout(() => setShowTile(true), delayOnMount);
        return () => {
            clearTimeout(timeoutIdRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ hide ]);

    /**
     * Subscribe to tile observer
     */
    useEffect(() => {
        if (tileElement.current === null) {
            return;
        }
        const currentElement = tileElement.current;
        observer.observe(currentElement);
        return () => observer.unobserve(currentElement);
    }, [ observer ]);

    return (
        <StyledTile
            ref={tileElement}
            transform={showTile ? transform : -(size.width + laneLeft + HIDE_OFFSET_SAFETY_MARGIN)}
            zIndex={zIndex}
            size={size}
        >
            {children}
        </StyledTile>
    );
}

export default Tile;
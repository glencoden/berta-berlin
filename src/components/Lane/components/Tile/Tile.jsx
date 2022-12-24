import { useEffect, useRef, useState } from 'react';
import { StyledTile } from './styled-components/StyledTile';
import { hideTileSafetyOffset, laneLeft, laneTileSlideInDelay } from '../../../../variables';
import { useApplicationContext } from '../../../../context';
import { TransitionType } from '../../../../enums/TransitionType';


function Tile({ hide, position, transform, zIndex, delay, setActive, observer, children }) {
    const { appState } = useApplicationContext();

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

    // when new tiles get rendered at the end of the list as the user is skipping through the videos (transition type none), their start transform is behind the tile pile and not out of viewport
    const hideTransform = !hide && appState.currentTransition === TransitionType.NONE ? 0 : -(appState.tileSize.width + laneLeft + hideTileSafetyOffset);

    return (
        <StyledTile
            data-position={position}
            ref={tileElement}
            transform={showTile ? transform : hideTransform}
            zIndex={zIndex}
            size={appState.tileSize}
            onClick={setActive}
        >
            {children}
        </StyledTile>
    );
}

export default Tile;
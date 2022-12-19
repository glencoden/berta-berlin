import { createContext, useContext } from 'react';
import { usePlayerReducer } from './reducer';
import { initialPlayerState } from './initialPlayerState';

const initialContext = {
    playerState: initialPlayerState,
    dispatch: null,
};

const PlayerContext = createContext(initialContext);

export const usePlayerContext = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [ state, dispatch ] = usePlayerReducer();

    return (
        <PlayerContext.Provider value={{ playerState: state, dispatch }}>
            {children}
        </PlayerContext.Provider>
    );
};
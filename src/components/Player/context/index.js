import { createContext, useContext } from 'react';
import { initialPlayerState, usePlayerReducer } from './reducer';

const initialContext = {
    state: initialPlayerState,
    dispatch: null
};

const PlayerContext = createContext(initialContext);

export const usePlayerContext = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [state, dispatch] = usePlayerReducer();

    return (
        <PlayerContext.Provider value={{ state, dispatch }}>
            {children}
        </PlayerContext.Provider>
    );
};
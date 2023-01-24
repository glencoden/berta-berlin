import { createContext, useContext } from 'react';
import { useApplicationReducer } from './reducer';
import { initialApplicationState } from './initialApplicationState';

const initialContext = {
    appState: initialApplicationState,
    dispatch: null,
};

const ApplicationContext = createContext(initialContext);

export const useApplicationContext = () => useContext(ApplicationContext);

export const ApplicationProvider = ({ children }) => {
    const [ state, dispatch ] = useApplicationReducer();

    return (
        <ApplicationContext.Provider value={{ appState: state, dispatch }}>
            {children}
        </ApplicationContext.Provider>
    );
};
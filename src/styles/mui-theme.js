import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#330e62',
        },
        secondary: {
            main: '#4a148c',
        },
        info: {
            main: '#fff', // TODO find an easier white (eg #fcfcfc) and apply to body bg, button bg and info.main and all white
        },
    },
});
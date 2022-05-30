import { StyledNavigationTitle } from './styled-components/StyledNavigationTitle';
import Typography from '@mui/material/Typography';
import Headline from '../../../Headline/Headline';
import { useApplicationContext } from '../../../../context';


function NavigationTitle() {
    const { appState } = useApplicationContext();

    return (
        <StyledNavigationTitle visible={appState.isMenuOpen}>
            <Typography
                variant="h4"
                as="h1"
                color="primary.light"
            >
                <Headline/>
            </Typography>
        </StyledNavigationTitle>
    );
}

export default NavigationTitle;
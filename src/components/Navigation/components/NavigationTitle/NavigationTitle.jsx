import { StyledNavigationTitle } from './styled-components/StyledNavigationTitle';
import Typography from '@mui/material/Typography';
import Headline from '../../../Headline/Headline';


function NavigationTitle({ isNavigationOpen }) {
    return (
        <StyledNavigationTitle isNavigationOpen={isNavigationOpen}>
            <Typography
                variant="h4"
                as="h1"
                color="primary.light"
            >
                <Headline />
            </Typography>
        </StyledNavigationTitle>
    );
}

export default NavigationTitle;
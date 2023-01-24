import { StyledLoadingMessage } from './styled-components/StyledLoadingMessage';
import Typography from '@mui/material/Typography';


function LoadingMessage({ visible, children }) {
    return (
        <StyledLoadingMessage visible={visible}>
            <Typography
                variant="h2"
                as="h1"
                align="center"
                color="primary.light"
            >
                {children}
            </Typography>
        </StyledLoadingMessage>
    );
}

export default LoadingMessage;
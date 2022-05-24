import { StyledDeviceWall } from './styled-components/StyledDeviceWall';
import Typography from '@mui/material/Typography';
import { minDeviceWidth } from '../../styles/variables';

function DeviceWall() {
    return (
        <StyledDeviceWall>
            <Typography
                className="device-wall-content"
                variant="h4" as="h1"
                align="center"
            >
                Please turn device or view on a larger screen<br/>(min width {minDeviceWidth}px)
            </Typography>
        </StyledDeviceWall>
    );
}

export default DeviceWall;
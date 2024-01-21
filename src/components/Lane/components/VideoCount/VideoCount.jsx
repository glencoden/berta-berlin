import { StyledVideoCount } from "./styled-components/StyledVideoCount";
import Typography from "@mui/material/Typography";

function VideoCount({ label }) {
    return (
        <StyledVideoCount>
            <Typography>
                {label}
            </Typography>
        </StyledVideoCount>
    );
}

export default VideoCount;
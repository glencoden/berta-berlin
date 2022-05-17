import { StyledTile } from './styled-components/StyledTile';
import Image from '../../../Image/Image';


function Tile({ index, url, size, title }) {
    return (
        <StyledTile index={index}>
            <Image
                url={url}
                width={size.width}
                height={size.height}
                title={title}
            />
        </StyledTile>
    );
}

export default Tile;
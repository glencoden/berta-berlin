import { useEffect, useRef, useState } from 'react';
import { StyledImage } from './styled-components/StyledImage';

const IMAGE_LOADING_TIMEOUT = 5;


function Image({ url, width, height, title, className }) {
    const imageRef = useRef(null);

    const [ src, setSrc ] = useState('');
    const [ loaded, setLoaded ] = useState(false);

    useEffect(() => {
        setLoaded(false);
        setSrc(url);
        const timeoutId = setTimeout(() => setLoaded(true), IMAGE_LOADING_TIMEOUT * 1000);
        return () => clearTimeout(timeoutId);
    }, [ url ]);

    const imageStyle = { opacity: 1 };

    if (!loaded) {
        imageStyle.opacity = 0;
        imageStyle.transition = 'none';
    }

    return (
        <StyledImage
            className={className}
            width={width}
            height={height}
        >
            {src && (
                <img
                    className="image"
                    style={imageStyle}
                    ref={imageRef}
                    src={src}
                    alt={title}
                    onLoad={() => setLoaded(true)}
                />
            )}
        </StyledImage>
    );
}

export default Image;
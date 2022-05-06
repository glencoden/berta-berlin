import { useEffect } from 'react';

function App() {
    useEffect(() => {
        console.log(
            '%cglencoden ❤️ version 0.0.1',
            `font-size: 1rem;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            color: white;
            background:linear-gradient(#E66465, #9198E5);`
        );

        // fetch('https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=KEY&part=snippet,contentDetails,statistics,status')
        //     .then(response => {
        //         response.json()
        //             .then(result => console.log(result));
        //     });
    }, []);

    return (
        <div className="text-3xl font-bold text-center py-12">
            glen coden - berta berlin
        </div>
    );
}

export default App;

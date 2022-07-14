const validGenres = [
    'Jazz',
    'Pop',
    'Rock',
    'Electronic',
    'HipHop',
    'World',
].map((genre) => genre.toLowerCase());

export const getVideoGenres = (video) => {
    if (!Array.isArray(video?.tags)) {
        return [];
    }
    const tagList = video.tags.map((tag) => tag.toLowerCase());
    return tagList.filter((tag) => validGenres.includes(tag));
};
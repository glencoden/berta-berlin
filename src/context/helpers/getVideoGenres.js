import { validGenres } from '../../variables';

const GENRES = validGenres.map((genre) => genre.toLowerCase());

export const getVideoGenres = (video) => {
    if (!Array.isArray(video?.tags)) {
        return [];
    }
    const tagList = video.tags.map((tag) => tag.toLowerCase());
    return tagList.filter((tag) => GENRES.includes(tag));
};
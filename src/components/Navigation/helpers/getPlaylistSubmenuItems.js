export const getPlaylistSubmenuItems = (playlists) => {
    return playlists.map(playlist => ({
        label: playlist.title,
        value: playlist.id,
    }));
};
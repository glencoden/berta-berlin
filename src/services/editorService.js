class EditorService {
    getVideos(videos) {
        if (videos === null) {
            console.warn('no videos');
            return;
        }
        const dupe = [ ...videos ];
        const result = [];
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * dupe.length);
            const randomItem = { ...dupe[ randomIndex ] };
            dupe.splice(randomIndex, 1);
            result.push(randomItem);
        }
        return result;
    }
}

export const editorService = new EditorService();
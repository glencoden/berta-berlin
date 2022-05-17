class EditorService {
    getVideos(videos) {
        if (videos === null) {
            console.warn('no videos');
            return;
        }
        const result = [];
        for (let i = 0; i < 10; i++) {
            result.push(videos[Math.floor(Math.random() * videos.length)]);
        }
        return result;
    }
}

export const editorService = new EditorService();
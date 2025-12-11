import { useState, useEffect } from "react";

export const useLessonsListLoader = () => {
    const [Lessons, setLessons] = useState([]);
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        const isLocal = localStorage.getItem("isLocal");
        if (isLocal == 'true') {
            LoadLocalLesson();
        }
    }, []);

    const LoadLocalLesson = () => {
        try {
            setIsLoad(true);

            const loadedLessons = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                if (key.startsWith("lesson:")) {
                    const item = localStorage.getItem(key);
                    if (!item) continue;

                    const lesson = JSON.parse(item);
                    loadedLessons.push({
                        ...lesson,
                        id: key.replace("lesson:_", "")
                    });
                }
            }

            const lessons = loadedLessons
                .sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt))
                .map(l => ({
                    title: l.title,
                    description: l.description,
                    cardsLength: l.cards.length,
                    id: l.id,
                    author: 'you'
                }));

            setLessons(lessons);
        } catch (err) {
            console.error('❌ Error loading lessons:', err);
        } finally {
            setIsLoad(false);
        }
    }

    return { Lessons, isLoad };
}
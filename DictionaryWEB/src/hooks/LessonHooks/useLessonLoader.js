import { useEffect, useState } from "react";

export const useLessonLoader = ({ lessonName, onError = (error) => { } }) => {
    const [Lesson, setLesson] = useState({});
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        setIsLoad(true);

        const LessonFromLocalStorage = localStorage.getItem('lesson:_' + lessonName);

        if (LessonFromLocalStorage) {
            const lesson = JSON.parse(LessonFromLocalStorage);
            lesson.type = 'local';
            lesson.id = 'lesson:_' + lessonName;

            setLesson(lesson);
            setIsLoad(false);
        }
        else {
            onError(new Error('Lesson not found'));
            setIsLoad(false);
        }
    }, [lessonName]);

    return { Lesson, isLoad };
}
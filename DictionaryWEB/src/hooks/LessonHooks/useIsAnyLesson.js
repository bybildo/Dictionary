import { useState, useEffect } from "react";

export const useIsAnyLesson = () => {
    const [isHaveLesson, setIsHaveLesson] = useState(false);
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        UpdateIsHaveLesson();
    }, []);

    const UpdateIsHaveLesson = () => {
        const isLocal = localStorage.getItem("isLocal");
        if (isLocal == 'true') {
            isHaveLocalLesson();
        }
    }

    const isHaveLocalLesson = () => {
    setIsLoad(true);

    let found = false;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("lesson:_")) {
            found = true;
            break;
        }
    }

    setIsHaveLesson(found);
    setIsLoad(false);
};


    return {isHaveLesson, isLoad, UpdateIsHaveLesson};
}
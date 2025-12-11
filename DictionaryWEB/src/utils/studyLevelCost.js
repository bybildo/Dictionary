export const getCostOfLesson = (lessonType) => {
    lessonType = lessonType % 100;

    switch (lessonType) {
        case 1: return { plus: 0, minus: 0 };
        case 2: return { plus: 15, minus: -20 };
        case 3: return { plus: 15, minus: -20 };
        case 4: return { plus: 10, minus: -20 };
        case 5: return { plus: 20, minus: -20 };
        case 6: return { plus: 35, minus: -20 };
        default: return { plus: 0, minus: 0 };
    }
}
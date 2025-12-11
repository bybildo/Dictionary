import { useState } from 'react';
import { v4 as guid } from 'uuid';
import { maxWordLength, maxCardLength } from '@utils/constants';

export function useLessonBuilder() {
    const [Words, setWords] = useState([{ id: guid(), term: '', definition: '', isEnd: true }]);

    const updateWord = (index, key, value) => {
        setWords(prevWords => {

            const updatedWords = prevWords.map((word, i) =>
                i === index ? { ...word, [key]: value, isEnd: false } : word
            );

            if (index === prevWords.length - 1 && value.trim() !== '' && Words.length < maxCardLength) {
                updatedWords.push({ id: guid(), term: '', definition: '', isEnd: true });

                setTimeout(() => {
                    window.scrollBy({
                        top: 2000,
                        behavior: 'smooth'
                    });
                }, 0);
            }

            return updatedWords;
        });
    };

    function swapWords() {
        setTimeout(() => {
            setWords(prevWords =>
                prevWords.map(word => ({ ...word, term: word.definition, definition: word.term }))
            )
        }, 100);
    }

    const deleteWord = (idToDelete) => {
        setTimeout(() => {
            setWords(prevWords => prevWords.filter(word => word.id !== idToDelete));
            if (!Words[Words.length - 1].isEnd && Words.length < maxCardLength + 1) setWords(prevWords => [...prevWords, { id: guid(), term: '', definition: '', isEnd: true }]);
        }, 0);
    }

    const GetCards = (filtredCards = Words) => {
        return filtredCards.filter(w => !w.isEnd).map((w, i) => ({index: i, term: w.term, definition: w.definition, studyLevel: 0 }));
    };

    const lessonLocalSave = (lessonName, LessonDescription) => {
        const localStorageName = 'lesson:_' + lessonName.replace(/\s+/g, '_');
        const filtredCards = Words.filter(w => !w.isEnd);
        const cards = GetCards(filtredCards);

        if (lessonName === '') throw new Error('Add a title');
        if (cards.length < 1) throw new Error('Add at least one card');

        const incompleteCards = filtredCards.findIndex(w => w.term === '' || w.definition === '');
        if (incompleteCards != -1) throw new Error(`Card ${incompleteCards + 1} is not filled in`);

        const oversizedCards = filtredCards.findIndex(w => w.term.length > maxWordLength || w.definition.length > maxWordLength);
        if (oversizedCards != -1) throw new Error(`Card ${oversizedCards + 1} is too long`);

        if (localStorage.getItem(localStorageName) !== null) {
            throw new Error('You already have a lesson with that Title');
        }

        const nowDate = new Date().toUTCString();
        const lesson = { title: lessonName, description: LessonDescription, cards: cards, createdAt: nowDate, openedAt: nowDate };
        try {
            localStorage.setItem(localStorageName, JSON.stringify(lesson));
        }
        catch {
            throw new Error('Your local storage is full, delete other lessons, or try reducing the number of cards.');
        }
    };

    return { Words, setWords, updateWord, swapWords, deleteWord, lessonLocalSave };
}
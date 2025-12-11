import Flashcard from "./Flashcard/Flashcard.jsx";
import ChooseWord from "./ChooseWord/ChooseWord.jsx";
import CompileWord from "./CompileWord/CompileWord.jsx";
import ChooseTranslationAudio from "./ChooseTranslationAudio/ChooseTranslationAudio.jsx";
import { useEffect, useState } from "react";
import { shuffle } from "@utils/shuffle.js";
import { getCostOfLesson } from "@utils/studyLevelCost.js";
import { add } from "@dnd-kit/utilities";

export const useLearningController = ({ learningType, setLearningType, cards, addPoint, onEscapePassed, onClose }) => {
    const [memorizationCards, setMemorizationCards] = useState(null);
    const onMemorizationEnd = () => setLearningType(el => el + 1);

    const onCorrect = (index) => addPoint(index, getCostOfLesson(learningType).plus);
    const onWrong = (index) => addPoint(index, getCostOfLesson(learningType).minus);

    useEffect(() => {
        if (learningType == 0) setMemorizationCards(getMemorizationCards());

        if (learningType > 100) {
            setMemorizationCards(el => shuffle(el));
        }

        window?.speechSynthesis?.cancel();
    }, [learningType]);

    function getMemorizationCards(count = 6) {
        if (!cards || cards.length === 0) return [];

        const firstCount = Math.floor(count * 0.7);
        const sorted = [...cards].sort((a, b) => a.studyLevel - b.studyLevel);
        const selected = sorted.slice(0, firstCount);

        const remainingCards = sorted.slice(firstCount);
        const remainingCount = count - selected.length;

        for (let i = 0; i < remainingCount && remainingCards.length > 0; i++) {
            const totalWeight = remainingCards.reduce((sum, card) => sum + (1 / (card.studyLevel + 1)), 0);
            let rand = Math.random() * totalWeight;
            for (let j = 0; j < remainingCards.length; j++) {
                rand -= 1 / (remainingCards[j].studyLevel + 1);
                if (rand <= 0) {
                    selected.push(remainingCards[j]);
                    remainingCards.splice(j, 1);
                    break;
                }
            }
        }

        return selected;
    }


    function addPointToAllCards(points) {
        memorizationCards?.forEach(card => addPoint(card.index, points));
    };

    const getElemenstFromType = (type) => {
        switch (type) {
            case 0:
                return <Flashcard cards={memorizationCards} onEscapePassed={onEscapePassed} onEnd={() => { setLearningType(102); addPointToAllCards(5) }} />
            case 1:
                return <Flashcard cards={cards} onEscapePassed={onEscapePassed} onEnd={onClose} />;
            case 2:
                return <ChooseWord cards={cards} onEscapePassed={onEscapePassed} onEnd={onClose} onCorrect={onCorrect} onWrong={onWrong} />;
            case 3:
                return <ChooseWord cards={cards.map(card => ({ ...card, definition: card.term, term: card.definition }))} onEscapePassed={onEscapePassed} onEnd={onClose} onCorrect={onCorrect} onWrong={onWrong} />;
            case 4:
                return <CompileWord cards={cards} onEscapePassed={onEscapePassed} onEnd={onClose} format="audio" onCorrect={onCorrect} onWrong={onWrong} />;
            case 5:
                return <ChooseTranslationAudio cards={cards} onEscapePassed={onEscapePassed} onEnd={onClose} onCorrect={onCorrect} onWrong={onWrong} />;
            case 6:
                return <CompileWord cards={cards} onEscapePassed={onEscapePassed} onEnd={onClose} onCorrect={onCorrect} onWrong={onWrong} />;

            case 102:
                return <ChooseWord memorizationCards={memorizationCards} cards={cards} onEscapePassed={onEscapePassed} onEnd={onMemorizationEnd} onCorrect={onCorrect} onWrong={onWrong} />;
            case 103:
                return <ChooseWord memorizationCards={memorizationCards?.map(card => ({ ...card, definition: card.term, term: card.definition }))} onCorrect={onCorrect} onWrong={onWrong} cards={cards.map(card => ({ ...card, definition: card.term, term: card.definition }))} onEscapePassed={onEscapePassed} onEnd={onMemorizationEnd} />;
            case 104:
                return <CompileWord memorizationCards={memorizationCards} cards={cards} onEscapePassed={onEscapePassed} onEnd={onMemorizationEnd} format="audio" onCorrect={onCorrect} onWrong={onWrong} />;
            case 105:
                return <ChooseTranslationAudio memorizationCards={memorizationCards} cards={cards} onEscapePassed={onEscapePassed} onEnd={onMemorizationEnd} onCorrect={onCorrect} onWrong={onWrong} />;
            case 106:
                return <CompileWord memorizationCards={memorizationCards} cards={cards} onEscapePassed={onEscapePassed} onEnd={onClose} onCorrect={onCorrect} onWrong={onWrong} />;
            default: return null;
        }
    }

    const LearningElemts = getElemenstFromType(learningType);

    return { LearningElemts };
};
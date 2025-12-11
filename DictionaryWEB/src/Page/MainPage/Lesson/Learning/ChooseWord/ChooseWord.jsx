import '@styles/tooltip.css';
import style from './style.module.css'
import { useEffect, useRef, useState } from 'react';
import { getFontSize } from '@utils/getFontSize.js';
import Masonry from 'react-masonry-css';
import { shuffle } from '@utils/shuffle';

function ChooseWord({ memorizationCards, cards, onEscapePassed, onCorrect, onWrong, onEnd }) {
    const [ChooseWordData, setChooseWordData] = useState({ mainWordIndex: 0, mainWord: '', variantWords: [], order: [] });
    const currentWordIndex = ChooseWordData.order[ChooseWordData.mainWordIndex]?.index;
    const currentDef = ChooseWordData.order[ChooseWordData.mainWordIndex]?.definition || '';

    const vh = window.innerHeight / 100;
    const defButtonVerticalPadding = 1.5 * vh;
    const defButtonHeight = 14 * vh;

    const chooseWordRef = useRef(null);
    const termRef = useRef(null);
    const definitionsRef = useRef([]);

    const [termFontSize, setTermFontSize] = useState(3.5);
    const [isOpenTerm, setIsOpenTerm] = useState(false);
    const termMaxHeight = `${termRef.current?.scrollHeight}px`;

    const [isAnswerGiven, setIsAnswerGiven] = useState(false);
    const [isAnimate, setIsAnimate] = useState(false);
    const [isShowTermTooltip, setIsShowTitleTooltip] = useState(true);
    const [isShowDefTooltip, setIsShowDefTooltip] = useState(false);
    const [countDefTooltip, setCountDefTooltip] = useState(0);

    useEffect(() => {
        chooseWordRef.current.focus();
        UpdateChooseDataOrder();
    }, [memorizationCards])

    useEffect(() => {
        if (ChooseWordData.mainWord == '') return;

        setTermFontSize(getFontSize(ChooseWordData.mainWord.length, 3, 5, 100));
        UpdateDefLineHeights();
        setTimeout(() => {
            UpdateTooltipShow();
        }, 500);
    }, [ChooseWordData]);

    useEffect(() => {
        setIsAnswerGiven(false);

        if (ChooseWordData.mainWordIndex != 0 && ChooseWordData.mainWordIndex == ChooseWordData.order.length) {
            onEnd();
            return;
        }

        for (let i = 0; i < definitionsRef.current.length; i++) {
            if (!definitionsRef.current[i]) continue;
            definitionsRef.current[i].style.maxHeight = '0';
        }

        UpdateChooseDataVariantWords();
    }, [ChooseWordData.order, ChooseWordData.mainWordIndex]);

    const breakpointColumnsObj = {
        default: 2,
    };

    function UpdateChooseDataOrder() {
        const order = memorizationCards || shuffle(cards);
        const mainWord = order[0].term;
        const mainWordIndex = 0;
        setChooseWordData(prev => ({ ...prev, order, mainWord, mainWordIndex }));
    }

    function UpdateChooseDataVariantWords() {
        const variantWords = [...new Set(shuffle(cards.map(card => card.definition)))].slice(0, 6);
        if (!variantWords.includes(currentDef)) {
            const randomIndex = Math.floor(Math.random() * 6);
            variantWords[randomIndex] = currentDef;
        }

        setChooseWordData(prev => ({ ...prev, variantWords }));

        if (definitionsRef.current) {
            for (let i = 0; i < definitionsRef.current.length; i++) {
                const el = definitionsRef.current[i];
                if (!el) continue;
                definitionsRef.current[i].classList.remove(style.wrong);
                definitionsRef.current[i].classList.remove(style.correct);
            }
        }
    }

    function UpdateTooltipShow() {
        if (lineCount(termRef.current) <= 2) {
            setIsShowTitleTooltip(false);
        }
        else {
            setIsShowTitleTooltip(true);
        }
    }

    const UpdateDefLineHeights = () => {
        const emptySpace = defButtonHeight - defButtonVerticalPadding * 2;
        for (let i = 0; i < definitionsRef.current.length; i++) {
            const el = definitionsRef.current[i];
            if (!el) continue;
            const lines = lineCount(definitionsRef.current[i]);
            if (lines <= 2) {
                definitionsRef.current[i].style.lineHeight = `${emptySpace / lines / vh}vh`;
            }
            else {
                definitionsRef.current[i].style.lineHeight = 'auto';
            }
        }
    };

    function lineCount(el) {
        if (!el) return 0;

        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = range.getClientRects();

        const lines = new Set(Array.from(rects, r => Math.round(r.top))).size;
        return lines;
    }

    function handleClearOpenedWords(e) {
        e.preventDefault();
        setIsOpenTerm(false);
        for (let i = 0; i < definitionsRef.current.length; i++) {
            definitionsRef.current[i].style.maxHeight = '0';
        }
    }

    function OnCorrectAnwer(index) {
        if (definitionsRef.current[index]) {
            !isAnswerGiven && onCorrect && onCorrect(currentWordIndex);
            setIsAnswerGiven(true);
            definitionsRef.current[index].classList.add(style.correct);
        }

        setTimeout(() => {
            setChooseWordData(prev => ({ ...prev, mainWordIndex: prev.mainWordIndex + 1, mainWord: prev.order[prev.mainWordIndex + 1]?.term || '' }));
        }, 900)
    }

    function OnWrongAnwer(index) {
        if (definitionsRef.current[index]) {
            !isAnswerGiven && onCorrect && onWrong(currentWordIndex);
            setIsAnswerGiven(true);
            definitionsRef.current[index].classList.add(style.wrong);
        }
    }

    const handleFlashcardKeyControlDown = (event) => {
        if (event.key == 'Escape') onEscapePassed(true);
    }

    const handleFlashcardKeyControlUp = (event) => {
        if (event.key == 'Escape') onEscapePassed(false);
    }

    const handleTermRightClick = (event) => {
        event.preventDefault();
        setIsShowTitleTooltip(false);
        setIsOpenTerm(!isOpenTerm);
    }

    const handleDefinitionButtonLeftClick = (index) => {
        if (isAnimate) return;
        setIsAnimate(true);

        if (ChooseWordData.variantWords[index] == currentDef) {
            OnCorrectAnwer(index);
            setTimeout(() => {
                setIsAnimate(false);
            }, 1000)
        }
        else {
            OnWrongAnwer(index);
            setTimeout(() => {
                setIsAnimate(false);
            }, 200)
        }
    }

    const handleDefinitionButtonRightClick = (event, index) => {
        event.preventDefault();
        setIsShowDefTooltip(false);

        if (definitionsRef.current[index]) {
            const maxHeight = `${definitionsRef.current[index].scrollHeight}px`;
            if (definitionsRef.current[index].style.maxHeight == maxHeight) {
                definitionsRef.current[index].style.maxHeight = '0';
            }
            else {
                definitionsRef.current[index].style.maxHeight = maxHeight;
            }
        }
    }

    const handleDefMouseEnter = (index) => {
        const length = lineCount(definitionsRef.current[index]);
        if (length > 3) {
            setIsShowDefTooltip(true);
            setCountDefTooltip(el => el + 1);
        }
    }

    const handleDefMouseLeave = (index) => {
        setIsShowDefTooltip(false);
    }

    return (
        <>
            <div onClick={handleClearOpenedWords} onContextMenu={handleClearOpenedWords} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></div>
            <div ref={chooseWordRef} className={style.chooseWord} onKeyDown={handleFlashcardKeyControlDown} onKeyUp={handleFlashcardKeyControlUp} tabIndex={0}>
                <div style={{ width: '100%' }} className='tooltip'>
                    <p ref={termRef} className={style.term} onContextMenu={handleTermRightClick}
                        style={{ fontSize: termFontSize, ...(isOpenTerm ? { maxHeight: termMaxHeight } : {}) }}>{ChooseWordData.mainWord}</p>
                    {isShowTermTooltip &&
                        <span style={{ fontSize: '2.2vh', marginBottom: '-10.5vh' }} className='tooltipText'>To expand, right-click</span>
                    }
                </div>
                <div className={style.definitions}>
                    <Masonry breakpointCols={breakpointColumnsObj} className={style.myMasonryGrid} columnClassName={style.myMasonryGridColumn}>
                        {ChooseWordData.variantWords.map((word, index) => (
                            <div key={index} className='tooltip' style={{ width: '100%' }}>
                                <p ref={el => definitionsRef.current[index] = el} className={style.definitionButton}
                                    onMouseEnter={() => handleDefMouseEnter(index)} onMouseLeave={() => handleDefMouseLeave(index)}
                                    onContextMenu={(e) => handleDefinitionButtonRightClick(e, index)}
                                    onClick={() => handleDefinitionButtonLeftClick(index)}>{word}</p>
                                {countDefTooltip < 2 && isShowDefTooltip &&
                                    <span style={{ fontSize: '1.8vh', marginBottom: '-7.5vh' }} className='tooltipText'>To expand, right-click</span>
                                }
                            </div>
                        ))}
                    </Masonry>
                </div>
            </div>
        </>
    )
}

export default ChooseWord
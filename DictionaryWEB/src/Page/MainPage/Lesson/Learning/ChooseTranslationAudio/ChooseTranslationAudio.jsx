import '@styles/tooltip.css';
import style from './style.module.css'
import { useEffect, useRef, useState } from 'react';
import Masonry from 'react-masonry-css';
import { shuffle } from '@utils/shuffle';
import { PiSpeakerSimpleHighFill } from "react-icons/pi";
import LocalVoiceSetting from '@components/LocalVoiceSetting/LocalVoiceSetting';
import { LoadLocalDefaultVoice, toSoundLocale } from '@utils/localVoiceActing';

function ChooseTranslationAudio({ memorizationCards, cards, onCorrect, onWrong, onEscapePassed, onEnd }) {
    const [ChooseTranslationData, setChooseWordData] = useState({ mainWordIndex: 0, mainWord: '', variantWords: [], order: [] });
    const currentWordIndex = ChooseTranslationData.order[ChooseTranslationData.mainWordIndex]?.index;
    const currentDef = ChooseTranslationData.order[ChooseTranslationData.mainWordIndex]?.definition || '';

    const vh = window.innerHeight / 100;
    const defButtonVerticalPadding = 1.5 * vh;
    const defButtonHeight = 14 * vh;

    const chooseTranslationRef = useRef(null);
    const definitionsRef = useRef([]);

    const [isAnswerGiven, setIsAnswerGiven] = useState(false);
    const [isAnimate, setIsAnimate] = useState(false);
    const [localVoice, setLocalVoice] = useState();
    const [audioTooltipCount, setAudioTooltipCount] = useState(0);
    const [isPlayAudio, setIsPlayAudio] = useState(false);
    const [isLocalVoiceSettingOpen, setIsLocalVoiceSettingOpen] = useState(false);
    const [isShowDefTooltip, setIsShowDefTooltip] = useState(false);
    const [countDefTooltip, setCountDefTooltip] = useState(0);


    useEffect(() => {
        chooseTranslationRef.current.focus();
        LoadLocalDefaultVoice(setLocalVoice);
        UpdateChooseDataOrder();
    }, [])

    useEffect(() => {
        if (ChooseTranslationData.mainWord == '') return;

        UpdateDefLineHeights();
    }, [ChooseTranslationData]);

    useEffect(() => {
        setIsAnswerGiven(false);

        if (ChooseTranslationData.mainWordIndex != 0 && ChooseTranslationData.mainWordIndex == ChooseTranslationData.order.length) {
            onEnd();
            console.log('onEnd');
            return;
        }

        setTimeout(() => {
            handlePlayAudio();
        }, 400)

        for (let i = 0; i < definitionsRef.current.length; i++) {
            if (!definitionsRef.current[i]) continue;
            definitionsRef.current[i].style.maxHeight = '0';
        }

        UpdateChooseDataVariantWords();
    }, [ChooseTranslationData.order, ChooseTranslationData.mainWordIndex]);

    const breakpointColumnsObj = {
        default: 2,
    };

    function UpdateChooseDataOrder() {
        const order = memorizationCards || shuffle(cards);
        const mainWord = order[0].term;
        setChooseWordData(prev => ({ ...prev, order, mainWord }));
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

    const handleKeyDown = (event) => {
        if (event.key == 'Escape') onEscapePassed(true);
        if (event.key == 'Enter' || event.key == ' ') handlePlayAudio();
    }

    const handledKeyUp = (event) => {
        if (event.key == 'Escape') onEscapePassed(false);
    }

    const handlePlayAudio = () => {
        toSoundLocale(ChooseTranslationData.mainWord, localVoice, isPlayAudio, setIsPlayAudio);
    }

    const handlePlayAudioSetting = (event) => {
        event.preventDefault();
        setIsLocalVoiceSettingOpen(!isLocalVoiceSettingOpen);
    }

    const handleDefinitionButtonLeftClick = (index) => {
        if (isAnimate) return;
        setIsAnimate(true);

        if (ChooseTranslationData.variantWords[index] == currentDef) {
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
            <div ref={chooseTranslationRef} className={style.chooseTranslationAudio} onKeyDown={handleKeyDown} onKeyUp={handledKeyUp} tabIndex={0}>
                <div className='tooltip' style={{ margin: '8vh 0', marginTop: '10vh' }}>
                    <PiSpeakerSimpleHighFill className={`${style.speaker} ${isPlayAudio ? style.active : ''}`}
                        onClick={handlePlayAudio} onContextMenu={handlePlayAudioSetting} onMouseEnter={() => setAudioTooltipCount(el => el + 1)} />
                    {audioTooltipCount < 2 && <span style={{ fontSize: '1.8vh' }} className='tooltipText'>Right button for settings</span>}
                </div>
                <div className={style.definitions}>
                    <Masonry breakpointCols={breakpointColumnsObj} className={style.myMasonryGrid} columnClassName={style.myMasonryGridColumn}>
                        {ChooseTranslationData.variantWords.map((word, index) => (
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
            {isLocalVoiceSettingOpen && <LocalVoiceSetting onClose={() => setIsLocalVoiceSettingOpen(false)}
                onSelectVoice={(localVoice) => setLocalVoice(localVoice)} selectVoice={localVoice} />}
        </>
    )
}

export default ChooseTranslationAudio
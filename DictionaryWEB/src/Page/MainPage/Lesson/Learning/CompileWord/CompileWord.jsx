import style from './style.module.css'
import '@styles/tooltip.css';
import { PiSpeakerSimpleHighFill } from "react-icons/pi";
import { IoIosBackspace } from "react-icons/io";
import LocalVoiceSetting from '@components/LocalVoiceSetting/LocalVoiceSetting';
import { LoadLocalDefaultVoice, toSoundLocale } from '@utils/localVoiceActing';
import { useEffect, useRef, useState } from 'react';
import { shuffle } from '@utils/shuffle';
import { getFontSize } from '@utils/getFontSize.js';


function CompileWord({ memorizationCards, cards, onCorrect, onWrong, onEscapePassed, onEnd, format = 'text' }) {
    const [CompileWordData, setCompileAudioData] = useState({ termIndex: 0, order: [], term: '', definision: '' });
    const currentWordIndex = CompileWordData.order[CompileWordData.termIndex]?.index;
    const сompileWordRef = useRef(null);
    const termRef = useRef(null);
    const intervalRef = useRef(null);

    const [tooltipCount, setAudioTooltipCount] = useState(0);
    const [isPlayAudio, setIsPlayAudio] = useState(false);
    const [localVoice, setLocalVoice] = useState();
    const [isLocalVoiceSettingOpen, setIsLocalVoiceSettingOpen] = useState(false);

    const [isAnswerGiven, setIsAnswerGiven] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isWrong, setIsWrong] = useState(false);

    const [userText, setUserText] = useState('');
    const [existingSymbols, setActiveSymbol] = useState([]);

    const [termFontSize, setTermFontSize] = useState(3.5);
    const [isOpenTerm, setIsOpenTerm] = useState(false);
    const [isShowTermTooltip, setIsShowTitleTooltip] = useState(true);
    const termMaxHeight = `${termRef.current?.scrollHeight}px`;

    useEffect(() => {
        сompileWordRef.current.focus();
        LoadLocalDefaultVoice(setLocalVoice);
        UpdateChooseDataOrder();
        setTimeout(() => {
            UpdateTooltipShow();
        }, 500)
    }, [])

    useEffect(() => {
        setIsAnswerGiven(false);

        if (CompileWordData.termIndex != 0 && CompileWordData.termIndex == CompileWordData.order.length) {
            onEnd();
            return;
        }

        if (format == 'audio')
            setTimeout(() => {
                handlePlayAudio();
            }, 400)

        if (format == 'text')
            setTermFontSize(getFontSize(CompileWordData.term.length, 3, 6, 100));

        const symbols = [...new Set(CompileWordData.definision.toUpperCase().replace(/\s+/g, ""))].sort();
        setActiveSymbol(symbols);
        setUserText(CompileWordData.definision.split(" ").map((word) => "ㅤ".repeat(word.length)).join("  "));
    }, [CompileWordData.order, CompileWordData.termIndex]);

    useEffect(() => {
        if (CompileWordData.definision == '') return;

        if (userText.toLowerCase() == CompileWordData.definision.toLowerCase() && !isWrong) {
            onCorrectAnswer();
        }
    }, [userText]);

    function UpdateTooltipShow() {
        if (lineCount(termRef.current) <= 2) {
            setIsShowTitleTooltip(false);
        }
        else {
            setIsShowTitleTooltip(true);
        }
    }

    function lineCount(el) {
        if (!el) return 0;

        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = range.getClientRects();

        const lines = new Set(Array.from(rects, r => Math.round(r.top))).size;
        return lines;
    }

    function NextTerm() {
        if (CompileWordData.termIndex == CompileWordData.order.length - 1) {
            onEnd();
            return;
        }

        const termIndex = CompileWordData.termIndex + 1;
        const term = CompileWordData.order[termIndex].term;
        const definision = CompileWordData.order[termIndex].definition;
        setCompileAudioData(prev => ({ ...prev, termIndex, term, definision }));
    }

    function onCorrectAnswer() {
        setIsCorrect(true);
        !isAnswerGiven && onCorrect && onCorrect(currentWordIndex);
        setIsAnswerGiven(true);

        setTimeout(() => {
            NextTerm();
            setIsCorrect(false);
        }, 1500);
    }

    function onWrongAnswer() {
        setIsWrong(true);
        !isAnswerGiven && onWrong && onWrong(currentWordIndex);
        setIsAnswerGiven(true);

        setTimeout(() => {
            setUserText(CompileWordData.definision);
        }, 20)

        setTimeout(() => {
            NextTerm();
            setIsWrong(false);
        }, 1500)
    }

    function removeSymbolFromUserText() {
        setUserText(prev => {
            const chars = prev.split('');

            for (let i = chars.length - 1; i >= 0; i--) {
                if (chars[i] !== ' ' && chars[i] !== 'ㅤ') {
                    chars[i] = 'ㅤ';
                    break;
                }
            }

            return chars.join('');
        });
    }

    function addSymbolToUserText(symbol) {
        setUserText(userText.replace("ㅤ", symbol));
    }

    function UpdateChooseDataOrder() {
        var order = memorizationCards || shuffle(cards);
        if (format == 'audio') order = order.map(w => ({ ...w, definition: w.term }));
        const term = order[0].term;
        const definision = order[0].definition;
        setCompileAudioData(prev => ({ ...prev, order, term, definision }));
    }

    const handlePlayAudio = () => {
        toSoundLocale(CompileWordData.term, localVoice, isPlayAudio, setIsPlayAudio);
    }

    const handlePlayAudioSetting = (event) => {
        event.preventDefault();
        setIsLocalVoiceSettingOpen(!isLocalVoiceSettingOpen);
    }

    const handleKeyDown = (event) => {
        if (event.key == 'Escape') {
            onEscapePassed(true);
            return;
        }

        if (event.key == 'Enter') {
            if (userText.includes('ㅤ')) {
                if (format == 'audio')
                    handlePlayAudio();
            }
            else {
                if (userText.toLowerCase() != CompileWordData.definision.toLowerCase()) {
                    onWrongAnswer();
                }
            }
            return;
        }

        if (event.key == ' ' || event.key == 'Space') {
            event.preventDefault();
            return;
        }

        if (event.key == 'Backspace') {
            removeSymbolFromUserText();
            return;
        }

        if (event.key.length === 1) {
            addSymbolToUserText(event.key);
        }
    }

    const handleKeyUp = (event) => {
        if (event.key == 'Escape') onEscapePassed(false);
    }

    const handleOnBackSpaceDown = () => {
        removeSymbolFromUserText();
        intervalRef.current = setInterval(removeSymbolFromUserText, 150);
    }

    const handleOnBackSpaceUp = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    const handleTermRightClick = (event) => {
        event.preventDefault();
        setIsShowTitleTooltip(false);
        setIsOpenTerm(!isOpenTerm);
    }

    return (
        <>
            <div ref={сompileWordRef} className={style.compileWord} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={0}>
                {format == 'audio' &&
                    <div className={`${style.speakerContainer} tooltip`}>
                        <PiSpeakerSimpleHighFill className={`${style.speaker} ${isPlayAudio ? style.active : ''}`}
                            onClick={handlePlayAudio} onContextMenu={handlePlayAudioSetting} onMouseEnter={() => setAudioTooltipCount(el => el + 1)} />
                        {tooltipCount < 2 && <span style={{ fontSize: '1.8vh' }} className='tooltipText'>Right button for settings</span>}
                    </div>
                }
                {format == 'text' &&
                    <div style={{ width: '100%' }} className='tooltip'>
                        <p ref={termRef} className={style.term} onContextMenu={handleTermRightClick}
                            style={{ marginTop: userText.length < 50 ? '15vh' : userText.length < 100 ? '10vh' : '2vh', fontSize: termFontSize, ...(isOpenTerm ? { maxHeight: termMaxHeight } : {}) }}>{CompileWordData.term}</p>
                        {isShowTermTooltip &&
                            <span style={{ fontSize: '2.2vh', marginBottom: '-5.5vh' }} className='tooltipText'>To expand, right-click</span>
                        }
                    </div>
                }
                <div className={style.userTextContainer}>
                    <p className={`${style.userText} ${isWrong ? style.wrong : ''}`}>
                        {
                            userText.split('').map((char, i) => (
                                <span
                                    key={i}
                                    style={{
                                        opacity: char === 'ㅤ' ? 0.6 : 1,
                                        fontSize: char === 'ㅤ' ? '7vh' : '5vh',
                                        animationDelay: `${i * (0.3 / userText.length)}s`
                                    }}
                                    className={isCorrect ? style.bounce : ''}
                                >
                                    {char === 'ㅤ' ? '_' : char}
                                </span>
                            ))}
                    </p>
                    <p className={style.skipTerm} style={{ maxHeight: isWrong ? '0' : '3vh', marginTop: isWrong ? '0' : '1.5vh' }} onClick={() => onWrongAnswer()}>Don't know</p>
                </div>
                <div className={style.symbols}>
                    <div style={{ width: '2.3vw' }}></div>
                    {existingSymbols.map((el, i) =>
                        <p key={i} className={style.symbol} onClick={() => addSymbolToUserText(el.toLowerCase())}>{el}</p>)}
                    <IoIosBackspace className={style.backspace} onMouseDown={handleOnBackSpaceDown} onMouseUp={handleOnBackSpaceUp} onMouseLeave={handleOnBackSpaceUp} />
                </div>
            </div >
            {isLocalVoiceSettingOpen && <LocalVoiceSetting onClose={() => setIsLocalVoiceSettingOpen(false)}
                onSelectVoice={(localVoice) => setLocalVoice(localVoice)} selectVoice={localVoice} />
            }
        </>
    )
}

export default CompileWord
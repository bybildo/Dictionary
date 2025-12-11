import { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import Word from '../Word/Word.jsx';
import { v4 as guid } from 'uuid';
import { textareaAutoResize } from '@utils/textareaAutoResize.js';

function QuickFill({ onCancel, onImport }) {
    const textareaRef = useRef(null);
    const betweenWordsInputRef = useRef(null);
    const betweenCardsInputRef = useRef(null);
    const [selectedWordsOption, setSelectedWordsOption] = useState('option1');
    const [selectedCardsOption, setSelectedCardsOption] = useState('option1');
    const [exampleCards, setExampleCards] = useState([]);

    useEffect(() => {
        UpdatePlaceholder();
        textareaAutoResize(textareaRef);
    }, []);

    useEffect(() => {
        UpdatePlaceholder();
        GetCards(true);
    }, [selectedWordsOption, selectedCardsOption]);

    const handleKeyDown = (e, ref) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = ref.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const value = textarea.value;
            if (ref === textareaRef) {
                textarea.value = value.substring(0, start) + '\t' + value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }
            else {
                if (value.length > 10) return;
                textarea.value = value.substring(0, start) + '\\t' + value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            }
        }

        if (e.key === 'Enter') {
            if (ref === textareaRef) return;

            e.preventDefault();
            const textarea = ref.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const value = textarea.value;
            if (value.length > 10) return;
            textarea.value = value.substring(0, start) + '\\n' + value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
    };

    const handleWordsChange = (e) => {
        setSelectedWordsOption(e.target.value);
        if (e.target.value == 'option2')
            betweenWordsInputRef.current?.focus();
    };

    const handleCardsChange = (e) => {
        setSelectedCardsOption(e.target.value);
        if (e.target.value == 'option2')
            betweenCardsInputRef.current?.focus();
    };

    const handleWordsFocus = () => {
        setSelectedWordsOption('option2');
    };

    const handleCardsFocus = () => {
        setSelectedCardsOption('option2');
    };

    const handleWordsUnFocus = () => {
        const input = betweenWordsInputRef.current.value;
        if (!input.includes(" ") && input.length < 1) {
            setSelectedWordsOption('option1');
        }

        GetCards(true);
    };

    const handleCardsUnFocus = () => {
        const input = betweenCardsInputRef.current.value;
        if (!input.includes(" ") && input.length < 1)
            setSelectedCardsOption('option1');

        GetCards(true);
    };

    function UpdatePlaceholder() {
        var wordSeparator = selectedWordsOption == 'option1' ? '\t' : betweenWordsInputRef.current.value;
        var cardSeparator = selectedCardsOption == 'option1' ? '\n' : betweenCardsInputRef.current.value;

        wordSeparator = wordSeparator.replace(/\\t/g, '\t').replace(/\\n/g, '\n');
        cardSeparator = cardSeparator.replace(/\\t/g, '\t').replace(/\\n/g, '\n');

        textareaRef.current.placeholder = "Term" + wordSeparator + "Definition" + cardSeparator + "Term" + wordSeparator + "Definition" + cardSeparator + "Term" + wordSeparator + "Definition";
    }

    function GetCards(isExample) {
        const userInput = textareaRef.current.value;

        if (userInput == '') {
            setExampleCards([]);
            return;
        }

        var wordSeparator = selectedWordsOption == 'option1' ? '\t' : betweenWordsInputRef.current.value;
        var cardSeparator = selectedCardsOption == 'option1' ? '\n' : betweenCardsInputRef.current.value;

        wordSeparator = wordSeparator.replace(/\\t/g, '\t').replace(/\\n/g, '\n');
        cardSeparator = cardSeparator.replace(/\\t/g, '\t').replace(/\\n/g, '\n');

        const cards = []

        if (wordSeparator != cardSeparator) {
            var lines = userInput.split(cardSeparator);
            for (var i = 0; i < lines.length; i++) {
                const separatorIndex = lines[i].indexOf(wordSeparator);

                if (separatorIndex !== -1) {
                    const term = lines[i].slice(0, separatorIndex);
                    const definition = lines[i].slice(separatorIndex + wordSeparator.length);
                    cards.push({ term, definition });
                } else {
                    cards.push({ term: lines[i], definition: '' });
                }

                if (isExample && i == 2) {
                    setExampleCards(cards);
                    return;
                }
            }
        }
        else {
            const parts = userInput.split(wordSeparator);

            for (let i = 0; i < parts.length; i += 2) {
                const term = parts[i];
                const definition = parts[i + 1] ?? '';
                cards.push({ term, definition });

                if (isExample && cards.length === 3) {
                    setExampleCards(cards);
                    return;
                }
            }
        }

        if (isExample) {
            setExampleCards(cards);
        }
        else {
            return cards;
        }
    }

    return (
        <>
            <div className={style.quickFill}>
                <div className={style.header}>
                    <p className={style.title}>Import copied text here</p>
                </div>
                <div>
                    <textarea maxLength={160000} translate='no' ref={textareaRef} className={style.textArea} onChange={() => GetCards(true)} onKeyDown={(e) => handleKeyDown(e, textareaRef)}></textarea>
                    <div className={style.buttons}>
                        <p onClick={onCancel}>Cancel</p>
                        <p onClick={() => onImport(GetCards(false))} style={{ color: '#01244A', background: '#AAD2E6' }}>Import</p>
                    </div>
                </div>
                <div className={style.radioButtons}>
                    <div>
                        <p>Between term and definition</p>
                        <label>
                            <input className={style.radioB}
                                type="radio"
                                name="betweenWords"
                                value="option1"
                                checked={selectedWordsOption === 'option1'}
                                onChange={handleWordsChange}
                            />
                            Tab
                        </label>

                        <label>
                            <input className={style.radioB}
                                type="radio"
                                name="betweenWords"
                                value="option2"
                                checked={selectedWordsOption === 'option2'}
                                onChange={handleWordsChange}
                            />
                            <input onChange={UpdatePlaceholder} onFocus={handleWordsFocus} onBlur={handleWordsUnFocus} ref={betweenWordsInputRef} className={style.inputs} type='text' maxLength={10} placeholder='your symbols' onKeyDown={(e) => handleKeyDown(e, betweenWordsInputRef)} />
                        </label>
                    </div>
                    <div>
                        <p>Between flashcards</p>
                        <label>
                            <input className={style.radioB}
                                type="radio"
                                name="betweenCards"
                                value="option1"
                                checked={selectedCardsOption === 'option1'}
                                onChange={handleCardsChange}
                            />
                            New line
                        </label>

                        <label>
                            <input className={style.radioB}
                                type="radio"
                                name="betweenCards"
                                value="option2"
                                checked={selectedCardsOption === 'option2'}
                                onChange={handleCardsChange}
                            />
                            <input onChange={UpdatePlaceholder} onFocus={handleCardsFocus} onBlur={handleCardsUnFocus} ref={betweenCardsInputRef} className={style.inputs} type='text' maxLength={10} placeholder='your symbols' onKeyDown={(e) => handleKeyDown(e, betweenCardsInputRef)} />
                        </label>
                    </div>
                </div>
                <div className={style.exampleCards}>
                    <p>Preview</p>
                    {exampleCards.length > 0 ?
                        exampleCards.map((card, index) => (
                            <Word id={guid()} key={index} index={index} term={card.term} definition={card.definition} isEnd={true} isReadOnly={true} />
                        )) :
                        <Word id={guid()} key={0} term={''} definition={''} isEnd={true} isReadOnly={true} />}
                </div>
            </div >
        </>
    );
}

export default QuickFill;
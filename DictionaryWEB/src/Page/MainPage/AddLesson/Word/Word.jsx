import React from 'react';
import style from './style.module.css';
import { useRef, useEffect, useState, forwardRef } from 'react';
import { IoIosWarning } from "react-icons/io";
import Lottie from "lottie-react";
import trashAnimation from "@assets/animation/trash.json"; ``
import thumbAnimation from "@assets/animation/thumb.json";
import handAnimation from "@assets/animation/hand.json";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { translateText } from '@services/translatorService';
import { maxWordLength } from '@utils/constants.js';

const Word = React.memo(forwardRef(function Word({ id, index, term, definition, onChange, onDelete, isEnd, onKeyDown, isReadOnly, isRender = true, languageCode = '' }, ref) {
    React.useImperativeHandle(ref, () => ({
        toTermFocus,
        toDefFocus
    }));

    const wordContainerRef = useRef(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const sortableStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isDragging ? 'grab' : 'auto',
        zIndex: isDragging ? 3 : 'auto',
    };

    var animationSpeed = 3;

    const [isTermAnimated, setIsTermAnimated] = useState(false);
    const [isDefAnimated, setIsDefAnimated] = useState(false);
    const [isHandAnimated, setIsHandAnimated] = useState(false);
    const [isWordAnimated, setIsWordAnimated] = useState(false);
    const [isEndWordAnimated, setIsEndWordAnimated] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [numOfTerms, setNumOfTerms] = useState(term.length);
    const [numOfDefs, setNumOfDefs] = useState(definition.length);

    const trashLottieRef = useRef();
    const handLottieRef = useRef();
    const thmbLottieRef = useRef();
    const termRef = useRef();
    const defRef = useRef();

    useEffect(() => {
        if (trashLottieRef.current) {
            trashLottieRef.current.stop();
        }
        if (handLottieRef.current) {
            handLottieRef.current.stop();
        }
        if (thmbLottieRef.current) {
            thmbLottieRef.current.stop();
        }
    }, [isRender]);

    useEffect(() => {
        if (numOfTerms > maxWordLength) {
            setIsTermAnimated(true);

            setTimeout(() => {
                setIsTermAnimated(false);
            }, 1000);
        }
    }, [numOfTerms])

    useEffect(() => {
        if (numOfDefs > maxWordLength) {
            setIsDefAnimated(true);

            setTimeout(() => {
                setIsDefAnimated(false);
            }, 1000);
        }
    }, [numOfDefs])

    const handleMouseEnter = () => {
        trashLottieRef.current?.play();
    };

    const handleMouseLeave = () => {
        trashLottieRef.current?.stop();
    };

    const handleDeleteWord = (e) => {
        if (e.shiftKey || e.ctrlKey || e.altKey) {
            onDelete(id);
            return;
        }

        setIsHandAnimated(true);
        handLottieRef.current?.setSpeed(animationSpeed);
        thmbLottieRef.current?.setSpeed(animationSpeed);
        handLottieRef.current?.play();
        thmbLottieRef.current?.play();

        setTimeout(() => {
            animationSpeed = 10;
            setIsWordAnimated(true);
            handLottieRef.current?.setSpeed(animationSpeed);
            thmbLottieRef.current?.setSpeed(animationSpeed);
        }, 850 / animationSpeed);

        setTimeout(() => {
            handLottieRef.current?.stop();
            thmbLottieRef.current?.stop();
            setIsHandAnimated(false);
            setIsEndWordAnimated(true);
        }, 1700 / animationSpeed);

        setTimeout(() => {
        }, 1800 / animationSpeed);

        setTimeout(() => {
            onDelete(id);
        }, 2200 / animationSpeed);
    };

    const handleKeyDown = (event, input) => {
        if (input === 'term') {
            if (event.key == 'Enter') {
                toDefFocus();
                return;
            }

            const inputLength = termRef.current.value.length;

            if (event.ctrlKey || event.altKey || inputLength == 0) {
                if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
                    toDefFocus();
                    return;
                }
            }

            if (inputLength == 0 && event.key === ' ') {
                event.preventDefault();
                return;
            }
        }
        else if (input === 'def') {
            const inputLength = defRef.current.value.length;

            if (event.ctrlKey || event.altKey || inputLength == 0) {
                if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
                    toTermFocus();
                    event.preventDefault();
                    return;
                }
            }

            if (inputLength == 0 && event.key === ' ') {
                event.preventDefault();
                return;
            }
        }

        onKeyDown(event, index, input);

        if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
            event.preventDefault();
            return;
        }
    }

    function toTermFocus() {
        termRef.current?.focus();
        return termRef.current;
    }

    function toDefFocus() {
        defRef.current?.focus();
        return defRef.current;
    }

    function activeScale() {
        setIsInputFocused(true);
    }

    function unActiveScale() {
        setIsInputFocused(false);
    }

    async function translate(text) {
        if (text.length < 1 || languageCode == '' || defRef.current.value.length > 0) return;

        try {
            const response = await translateText(text, languageCode);
            const translatedText = response?.[0]?.translations?.[0]?.text || '';

            onChange(index, 'definition', translatedText);
        } catch (error) {
            console.error('Translation error:', error);
        }
    }

    if (index >= 300) {
        return null;
    }

    if (!isRender && !isDragging) {
        return <di ref={(node) => {
            setNodeRef(node);
            wordContainerRef.current = node;
        }} style={sortableStyle} className={style.wordContainer}>
            <div className={style.word}>
                <p className={style.renderText}>Rendering</p>
            </div>
        </di>
    }

    return (
        <div ref={(node) => {
            setNodeRef(node);
            wordContainerRef.current = node;
        }}
            style={sortableStyle} className={`${style.wordContainer} ${isEndWordAnimated ? style.active : ''}`}>
            <Lottie lottieRef={thmbLottieRef} className={`${style.hand} ${isHandAnimated ? style.active : ''}`} animationData={handAnimation} loop={false} autoPlay={false} />
            <div className={`${style.word} ${isWordAnimated ? style.active : ''} ${isInputFocused ? style.activeScale : ''}`}>
                {!isEnd && (
                    <div className={style.wordMenu}>
                        <p className={style.numberOfLesson} {...attributes} {...listeners}>{index + 1}</p>
                        <Lottie lottieRef={trashLottieRef} className={style.trash} animationData={trashAnimation} loop={false} autoPlay={false} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => handleDeleteWord(e)} />
                    </div>
                )}

                <div className={`${style.wordInputs} ${isEnd ? style.isEnd : ''}`}>
                    <div>
                        <input readOnly={isReadOnly} ref={termRef} type="text" onFocus={activeScale} onBlur={(e) => {
                            unActiveScale(); setTimeout(() => {
                                translate(e.target.value);
                            }, 0);
                        }} placeholder="Term" maxLength={maxWordLength + 100} value={term} onChange={(e) => { onChange(index, 'term', e.target.value); setNumOfTerms(e.target.value.length); }} onKeyDown={(e) => handleKeyDown(e, 'term')} />
                        {!isEnd && numOfTerms > maxWordLength && <p className={isTermAnimated ? style.active : ''}> {numOfTerms}\{maxWordLength}  <IoIosWarning /></p>}
                    </div>
                    <div>
                        <input readOnly={isReadOnly} ref={defRef} type="text" onFocus={activeScale} onBlur={unActiveScale} placeholder="Definition" maxLength={maxWordLength + 100} value={definition} onChange={(e) => { onChange(index, 'definition', e.target.value); setNumOfDefs(e.target.value.length); }} onKeyDown={(e) => handleKeyDown(e, 'def')} />
                        {!isEnd && numOfDefs > maxWordLength && <p className={isDefAnimated ? style.active : ''}> {numOfDefs}\{maxWordLength}  <IoIosWarning /></p>}
                    </div>
                </div>
            </div>
            <Lottie lottieRef={handLottieRef} className={`${style.thumb} ${isHandAnimated ? style.active : ''}`} animationData={thumbAnimation} loop={false} autoPlay={false} />
        </div>
    );
}));

export default Word;
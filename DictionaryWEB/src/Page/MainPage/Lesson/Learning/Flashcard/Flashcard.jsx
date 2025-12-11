import { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import '@styles/tooltip.css';
import { getFontSize } from '@utils/getFontSize.js';
import { FaArrowsRotate } from "react-icons/fa6";
import { SvgDone } from "@components/svgs/index.js";

function Flashcard({ cards, onEscapePassed, onEnd}) {
    const timerRef = useRef(null);
    const timeoutRef = useRef(null);
    const flashcardRef = useRef(null);
    const cardsLength = cards?.length || 0;

    const [isFlipping, setIsFlipping] = useState(false);
    const [isChangingCard, setIsChangingCard] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [showBackgroundCard, setShowBackgroundCard] = useState(false);
    const [isBackgroundMouseEnter, setIsBackgroundMouseEnter] = useState(false);
    const [isAnimationNext, setIsAnimationNext] = useState(false);
    const [isAnimationPrev, setIsAnimationPrev] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [animationRotateDegree, setAnimationRotateDegree] = useState(0);
    const [buttonRotateDegree, setButtonRotateDegree] = useState(0);
    const [mouseDownPosition, setMouseDownPosition] = useState({ x: 0 });
    const [cardPosition, setCardPosition] = useState({ x: 0 });
    const [backgroundCardText, setBackgroundCardText] = useState('');
    const [hintCount, setHintCount] = useState({ prev: 0, next: 0, done: 0 });
    const [donePassed, setDonePassed] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const [termFontSize, setTermFontSize] = useState('2.5vh');
    const [defFontSize, setDefFontSize] = useState('2.5vh');
    const [backgroundFontSize, setBackgroundFontSize] = useState('2.5vh');

    const currentCard = cards?.[currentCardIndex] || {};
    const term = currentCard.term || '';
    const definition = currentCard.definition || '';
    const nextTerm = cards?.[currentCardIndex + 1]?.term || '';

    useEffect(() => {
        if (flashcardRef.current) {
            flashcardRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setBackgroundCardText(nextTerm);
        }, 200)
    }, [nextTerm]);

    useEffect(() => {
        setTermFontSize(getFontSize(term.length));
        setDefFontSize(getFontSize(definition.length));
        setBackgroundFontSize(getFontSize(nextTerm.length));
    }, [term.length, definition.length]);

    useEffect(() => {
        if (currentCardIndex < 0) {
            setCurrentCardIndex(0);
            return;
        }

        if (currentCardIndex >= cardsLength - 1) {
            setTimeout(() => {
                setIsDone(true);
            }, 200);
        }
        else {
            setIsDone(false);
        }

        if (currentCardIndex >= cardsLength) {
            setCurrentCardIndex(cardsLength - 1);
            return;
        }

        if (currentCardIndex >= cardsLength || currentCardIndex < 0) return;
        setAnimationRotateDegree(0);
        setIsChangingCard(true);
    }, [currentCardIndex]);

    useEffect(() => {
        if (isChangingCard) {
            setTimeout(() => {
                setIsChangingCard(false);
            }, 200);
        }
    }, [isChangingCard]);

    useEffect(() => {
        const xPercent = ((cardPosition.x + mouseDownPosition.x) / window.innerWidth) * 100;

        if ((xPercent < 20) || (80 < xPercent)) {
            setIsBackgroundMouseEnter(true);
        } else {
            setIsBackgroundMouseEnter(false);
        }
    }, [cardPosition, isMouseDown]);

    useEffect(() => {
        if (donePassed) {
            timerRef.current = setTimeout(() => {
                setDonePassed(false);
                onEnd();
            }, 1200);
        } else {
            clearTimeout(timerRef.current);
        }

        return () => clearTimeout(timerRef.current);
    }, [donePassed, onEnd]);

    const cardContainerOnMouseDownStyle = {
        transform: `${isBackgroundMouseEnter ? 'scale(0.95)' : 'scale(1.02)'} ${isBackgroundMouseEnter ? `rotateY(${cardPosition.x > 0 ? -10 : 10}deg)` : ''}`,
        opacity: isBackgroundMouseEnter ? 0.8 : 1,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
    };

    const cardOnMouseDownStyle = {
        transition: 'none',
        cursor: 'grabbing',
        transform: `rotateX(${animationRotateDegree}deg) translate(${cardPosition.x}px`
    };

    const cardAnimationNextStyle = {
        transform: `translateX(60vw) rotateY(-30deg) scale(1.1)`,
        opacity: 0,
        transition: 'transform 0.2s ease-in, opacity 0.2s ease-in',
    };

    const cardAnimationPrevStyle = {
        transform: `translateX(-60vw) rotateY(30deg) scale(1.1)`,
        opacity: 0,
        transition: 'transform 0.2s ease-in, opacity 0.2s ease-in',
    };


    const handlePrevCard = () => {
        if (cards[currentCardIndex - 1] === undefined) return;
        if (isAnimationPrev || isAnimationNext || isChangingCard) return;

        if (currentCardIndex === cardsLength - 1) {
            setCurrentCardIndex(prevIndex => prevIndex - 1);
            setAnimationRotateDegree(0);
            return;
        }

        setIsAnimationPrev(true);
        setShowBackgroundCard(true);
        setBackgroundCardText(cards[currentCardIndex - 1].term || '');

        setTimeout(() => {
            setIsChangingCard(true);
            setCurrentCardIndex(prevIndex => prevIndex - 1);
            setIsAnimationPrev(false);
            setShowBackgroundCard(false);
            setAnimationRotateDegree(0);
        }, 300);
    };

    const handleNextCard = (isAnimate = true) => {
        if (cards[currentCardIndex + 1] === undefined) return;
        if (isAnimationNext || isAnimationPrev || isChangingCard) return;

        if (isAnimate) {
            setIsAnimationNext(true);
            setShowBackgroundCard(true);

            setTimeout(() => {
                setIsChangingCard(true);
                setCurrentCardIndex(prevIndex => prevIndex + 1);
                setIsAnimationNext(false);
                setShowBackgroundCard(false);
                setAnimationRotateDegree(0);
            }, 300);
        } else {
            setCurrentCardIndex(prevIndex => prevIndex + 1);
        }
    };

    const handleTurnOverCard = () => {
        if (isChangingCard || isFlipping) return;
        setIsFlipping(true);
        setAnimationRotateDegree(prev => prev - 180);

        setTimeout(() => {
            setIsFlipping(false);
        }, 300);
    };

    const handleFlashcardKeyControlDown = (event) => {
        if (event.key == ' ' || event.key == 'Enter') handleTurnOverCard();
        if (event.key == 'ArrowLeft' && currentCardIndex > 0) handlePrevCard();
        if (event.key == 'ArrowRight') {
            if (currentCardIndex == cardsLength - 1)
                setDonePassed(true);
            handleNextCard();
        }
        if (event.key == 'Escape') onEscapePassed(true);
    }

    const handleFlashcardKeyControlUp = (event) => {
        if (event.key == 'Escape') onEscapePassed(false);
        if (event.key == 'ArrowRight') {
            if (currentCardIndex == cardsLength - 1)
                setDonePassed(false);
        }
    }

    const handleMouseDown = (e) => {
        setMouseDownPosition({ x: e.clientX });
        timeoutRef.current = setTimeout(() => {
            setIsMouseDown(true);
            if (nextTerm) {
                setShowBackgroundCard(true);
            }
        }, 90);
    };

    const handleMouseMove = (e) => {
        if (!isMouseDown) return;
        setCardPosition({
            x: e.clientX - mouseDownPosition.x,
        });
    }

    const handleMouseUp = () => {
        if (isBackgroundMouseEnter && isMouseDown) {
            if (currentCardIndex === cardsLength - 1) {
                onEnd();
            } else {
                setTimeout(() => setIsChangingCard(true), 100);
                handleNextCard(false);
                setTimeout(() => {
                    setShowBackgroundCard(false);
                }, 200);
            }
        } else if (isMouseDown) {
            setTimeout(() => {
                setShowBackgroundCard(false);
            }, 200);
        }

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setMouseDownPosition({ x: 0 });
            setCardPosition({ x: 0 });
            setIsMouseDown(false);
        }, 10);
    };


    return (
        <>
            <div className={style.flashcard}>
                {nextTerm && showBackgroundCard ? <div className={style.backgroundCard} style={{ fontSize: backgroundFontSize }}>{backgroundCardText}</div> : null}
            </div>
            <div className={`${style.background} ${isMouseDown ? style.active : ''} ${isBackgroundMouseEnter ? style.paint : ''} ${isDone ? style.last : ''}`} onMouseEnter={() => handleMouseUp()}></div>
            <div ref={flashcardRef} className={style.flashcard} onKeyDown={handleFlashcardKeyControlDown} onKeyUp={handleFlashcardKeyControlUp} tabIndex={0}>
                <div className={isChangingCard ? style.noTransition : ''} style={{
                    transition: 'all 0.2s ease-in-out', perspective: '90vw', ...(isMouseDown ? cardContainerOnMouseDownStyle : {}),
                    ...(isAnimationNext ? cardAnimationNextStyle : {}), ...(isAnimationPrev ? cardAnimationPrevStyle : {})
                }}>
                    <div className={`${style.card} ${!isAnimationNext && isChangingCard ? style.noTransition : ''}`} style={{
                        transform: `rotateX(${animationRotateDegree}deg)`,
                        ...(isMouseDown ? cardOnMouseDownStyle : {})
                    }}
                        onClick={isMouseDown ? null : handleTurnOverCard} onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                        <div className={`${style.cardFace} ${style.cardFront} `} style={{ fontSize: termFontSize }}>
                            {term}
                        </div>
                        <div className={`${style.cardFace} ${style.cardBack} `} style={{ fontSize: defFontSize }}>
                            {definition}
                        </div>
                    </div>
                </div>
                <div className={style.buttons} onMouseEnter={() => handleMouseUp()}>
                    <div className='tooltip' onMouseEnter={() => setHintCount(pre => ({ ...pre, prev: pre.prev + 1 }))} style={{ visibility: currentCardIndex <= 0 ? 'hidden' : 'visible' }}>
                        <p onClick={handlePrevCard} style={{ color: '#AAD2E6', paddingRight: '0.05vw' }}>{'<'}</p>
                        {hintCount.prev < 2 && <span className='tooltipText'>Previous Card</span>}
                    </div>
                    <div className={style.rotateContainer} onClick={() => { handleTurnOverCard(); setButtonRotateDegree(prev => prev + 180) }}>
                        <FaArrowsRotate className={style.rotate} opacity={0.97} style={{ transform: `rotate(${buttonRotateDegree}deg)` }} />
                    </div>
                    {currentCardIndex < cardsLength - 1 ?
                        <div className='tooltip' onMouseEnter={() => setHintCount(pre => ({ ...pre, next: pre.next + 1 }))}>
                            <p onClick={handleNextCard} style={{ color: '#AAD2E6', paddingLeft: '0.22vw' }}>{'>'}</p>
                            {hintCount.next < 2 && <span className='tooltipText'>Next Card</span>}
                        </div>
                        :
                        <div className='tooltip' onMouseEnter={() => setHintCount(pre => ({ ...pre, done: pre.done + 1 }))}>
                            <div className={style.doneContainer} >
                                <div className={`${style.doneAnimation} ${donePassed ? style.active : ''}`}> </div>
                                <SvgDone className={style.done} onClick={onEnd} />
                            </div>
                            {hintCount.done < 2 && <span className='tooltipText'>Finish</span>}
                        </div>
                    }
                </div>
            </div >
        </>
    );
}

export default Flashcard;
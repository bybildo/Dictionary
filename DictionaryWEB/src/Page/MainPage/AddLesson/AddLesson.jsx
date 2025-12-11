import { useRef, useEffect, useState } from 'react';
import style from './style.module.css';
import '@styles/tooltip.css';

import { MdPublic, MdOutlinePublicOff } from "react-icons/md";
import { IoMdSwap } from "react-icons/io";
import { v4 as guid } from 'uuid';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useNavigate } from 'react-router-dom';

import ShowMessage from '@components/showMessage.jsx';
import Word from './Word/Word.jsx';
import QuickFill from './QuickFill/QuickFill.jsx';
import ChooseLanguage from './ChooseLanguage/ChooseLanguage.jsx';
import FullScreenLoadingAnimation from '@components/fullScreenLoadingAnimation.jsx';

import { useTimeoutShowMessage } from '@hooks/useTimeoutShowMessage.js';
import { useLessonBuilder } from '@hooks/LessonHooks/useLessonBuilder.js';
import { textareaAutoResize } from '@utils/textareaAutoResize.js';
import { useAutoTranslate } from '@hooks/useAutoTranslate.js';
import { maxCardLength } from '@utils/constants';

function AddLesson() {
    const navigate = useNavigate();
    const textareaRef = useRef(null);
    const wordRefs = useRef([]);

    const [message, setMessage] = useState('');
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonDescription, setLessonDescription] = useState('');
    const [visibleWord, setVisibleWord] = useState(0);
    const [isImport, setIsImport] = useState(false);
    const [isAutoTranslate, setIsAutoTranslate] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState({ code: '', name: '' });

    const { Words, setWords, updateWord, swapWords, deleteWord, lessonLocalSave } = useLessonBuilder();
    const { showMessage, setShowMessage } = useTimeoutShowMessage(2000);

    useAutoTranslate({
        language,
        isEnabled: !isImport && language.code !== '',
        words: Words,
        setWords
    });

    useEffect(() => {
        const cleanup = textareaAutoResize(textareaRef);
        return cleanup;
    }, []);

    useEffect(() => {
        if (!isImport) {
            const cleanup = textareaAutoResize(textareaRef);
            return cleanup;
        }
    }, [isImport]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            setVisibleWord(Math.floor(scrollPercent / 100 * Words.length));
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [Words.length]);

    const handleAutoTranslateToggle = () => {
        if (language.code != '') {
            setLanguage({ code: '', name: '' });
            return;
        }

        setIsAutoTranslate(prev => !prev);
    };

    const handleSwapClick = () => {
        setSpinning(prev => !prev);
        swapWords();
    }

    const handleAnimationEnd = () => {
        setSpinning(false);
    };

    const handleVisibilityToggle = () => {
        setIsPublic(prev => !prev);
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setWords((words) => {
            const normalWords = words.filter(w => !w.isEnd);
            const endWord = words.find(w => w.isEnd);

            const oldIndex = normalWords.findIndex(w => w.id === active.id);
            const newIndex = normalWords.findIndex(w => w.id === over.id);

            if (oldIndex === -1 || newIndex === -1) return words;

            const updated = arrayMove(normalWords, oldIndex, newIndex);

            return [...updated, endWord];
        });
    };

    const handleWordKeyDown = (event, index, input) => {
        if (event.key === 'Enter') {
            const next = wordRefs.current[index + 1];
            if (next) {
                next.toTermFocus();
            }
        }
        if (event.key === 'ArrowUp') {
            const previous = wordRefs.current[index - 1];
            if (previous) {
                input.includes('term') ? previous.toTermFocus() : previous.toDefFocus();
            }
        }
        if (event.key === 'ArrowDown') {
            const next = wordRefs.current[index + 1];
            if (next) {
                input.includes('term') ? next.toTermFocus() : next.toDefFocus();
            }
        }
    }

    const handleSaveClick = () => {
        try {
            lessonLocalSave(lessonTitle, lessonDescription);
            navigate('/', {state: { refresh: true }});
        }
        catch (error) {
            setMessage(error.message);
            setShowMessage(true);
        }
    }

    async function onImport(cards) {
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 0));

        await onImportHeavy(cards);

        setIsLoading(false);
        setIsImport(false);

        setTimeout(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight
            });
        }, 10);

    }

    async function onImportHeavy(cards) {
        return new Promise((resolve) => {
            const maxLength = maxCardLength - Words.length;

            if (cards.length > 0) {
                if (cards.length > maxLength) cards = cards.slice(0, maxLength);

                setWords(prevWords => {
                    const newWords = cards.map(c => ({
                        id: guid(),
                        term: c.term,
                        definition: c.definition,
                        isEnd: false,
                    }));

                    const lastIndex = prevWords.length - 1;

                    resolve();
                    return [...prevWords.slice(0, lastIndex), ...newWords, ...prevWords.slice(lastIndex)];
                });
            } else {
                resolve();
            }
        });
    }

    const normalWords = Words.filter(w => !w.isEnd);

    return (
        <div className={style.addLesson}>
            {isImport &&
                <>
                    <div className='background' style={{ width: '100vw', height: '100vh', left: 0, top: 0, position: 'absolute' }} onClick={() => setIsImport(false)}></div>
                    <QuickFill className={style.quickFill} onCancel={() => setIsImport(false)} onImport={onImport} />
                </>
            }

            {isAutoTranslate &&
                <>
                    <div className='background' style={{ width: '100vw', height: '100vh', left: 0, top: 0, position: 'fixed', backdropFilter: 'blur(0.6vh)', zIndex: 4 }} onClick={() => setIsAutoTranslate(false)}></div>
                    <ChooseLanguage onChange={setLanguage} onClose={() => setIsAutoTranslate(false)} />
                </>
            }

            <div className={isImport ? style.isHide : ''}>
                <h1>Add a new lesson</h1>
                <div className={style.form}>
                    <input onChange={(e) => setLessonTitle(e.target.value)} className={style.input} type="text" placeholder="Lesson Title" maxLength="100" />
                    <textarea onChange={(e) => setLessonDescription(e.target.value)} className={style.textarea} ref={textareaRef} placeholder="Description" maxLength="1200"></textarea>
                </div>

                <div className={style.options}>
                    <div className='tooltip' onClick={() => setIsImport(true)}>
                        <p>Import</p>
                        <span className='tooltipText'>Quick fill</span>
                    </div>

                    <div className='tooltip' onClick={handleVisibilityToggle}>
                        <div className={style.visiblity}>
                            <div className={`${style.visiblityBar} ${isPublic ? style.visiblityActive : ''}`} />
                            <MdOutlinePublicOff className={`${style.icon1} ${isPublic ? '' : style.visiblityActive}`} />
                            <p className={style.divider}>|</p>
                            <MdPublic className={`${style.icon2} ${isPublic ? style.visiblityActive : ''}`} />
                        </div>
                        <span className='tooltipText'>Hidden or public</span>
                    </div>

                    <div className='tooltip'>
                        <p className={language.code != '' ? style.isActive : ''} onClick={handleAutoTranslateToggle}>{language.code == '' ? 'Auto' : language.name}</p>
                        <span className='tooltipText'>Automatically translate</span>
                    </div>

                    <div className='tooltip'>
                        <IoMdSwap
                            className={`${style.swap} ${spinning ? style.spin180 : ''}`}
                            onAnimationEnd={handleAnimationEnd}
                            onClick={handleSwapClick}
                        />
                        <span className='tooltipText'>Replace terms with definitions</span>
                    </div>
                </div>

                <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                    <SortableContext items={normalWords.map(w => w.id)} strategy={verticalListSortingStrategy}>
                        <ul className={style.words}>
                            {Words.map((word, index) => (
                                <li key={word.id}>
                                    <Word ref={el => wordRefs.current[index] = el} id={word.id} index={index} term={word.term} definition={word.definition}
                                        onChange={updateWord} isEnd={word.isEnd} onDelete={deleteWord} onKeyDown={handleWordKeyDown}
                                        languageCode={language.code} isRender={Words.length < 40 || index > visibleWord - 20 && index < visibleWord + 20} />
                                </li>
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>

                <div className={style.buttons}>
                    <p onClick={() => navigate('/')}>Cancel</p>
                    <p onClick={() => handleSaveClick()} style={{ color: '#01244A', backgroundColor: '#AAD2E6' }}>Save</p>
                </div>
            </div>
            {isLoading && <FullScreenLoadingAnimation backgroundStyle={{ backdropFilter: 'blur(0.6vh)', background: '#0a112813' }} />}
            <ShowMessage style={{ fontSize: '3vh', opacity: showMessage ? '1' : '0' }} message={message} />
        </div>
    );
}

export default AddLesson;

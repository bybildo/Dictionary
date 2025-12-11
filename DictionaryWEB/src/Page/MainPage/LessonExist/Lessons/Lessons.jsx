import { useEffect } from 'react';
import style from './style.module.css';
import { useLessonsListLoader } from '@hooks/LessonHooks/useLessonsListLoader.js';
import FullScreenLoadingAnimation from '@components/fullScreenLoadingAnimation.jsx';
import Masonry from 'react-masonry-css';
import LessonOnList from './LessonOnList/LessonOnList.jsx';

function Lessons({ columnLength, setColumnLength }) {
    const { Lessons, isLoad } = useLessonsListLoader();

    useEffect(() => {
        AutoColumn();
    }, [Lessons.length]);

    const AutoColumn = () => {
        const lessonLength = Lessons.length;
        if (lessonLength <= 6) {
            setColumnLength(1);
            return;
        }

        if (lessonLength <= 13) {
            setColumnLength(2);
            return;
        }

        setColumnLength(3);
    }

    const breakpointColumnsObj = {
        default: columnLength,
    };

    return (
        <div className={style.lessons}>
            {isLoad ? <FullScreenLoadingAnimation backgroundStyle={{ backdropFilter: 'blur(0.6vh)', background: '#0a112873' }} />
                :
                <Masonry breakpointCols={breakpointColumnsObj} className={style.myMasonryGrid} columnClassName={style.myMasonryGridColumn}>
                    {Lessons.map((lesson, index) => (
                        <LessonOnList key={index} id={lesson.id} title={lesson.title} description={lesson.description} cardsLength={lesson.cardsLength} author={lesson.author} />
                    ))}
                </Masonry>
            }
        </div>
    )
}

export default Lessons
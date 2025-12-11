import { memo, use, useEffect, useMemo, useRef, useState } from 'react';
import style from './style.module.css'
import { useParams } from 'react-router-dom'
import { useLessonLoader } from '@hooks/LessonHooks/useLessonLoader.js';
import { StudyLevelService } from '@services/StudyLevelService.js';
import Header from './Header/Header';
import Words from './Words/Words';
import { useLearningController } from './Learning/useLearningController.jsx'
import FullScreenLoadingAnimation from '@components/fullScreenLoadingAnimation.jsx';
import LearningButons from './LearningButons/LearningButons';
import CloseButton from '@components/closeButton.jsx';

function Lesson() {
    const [updateFlag, setUpdateFlag] = useState(0);
    var count = 0;
    const { lessonName } = useParams();
    const { Lesson, isLoad } = useLessonLoader({ lessonName: lessonName, onError: (error) => setErrorMessage(error.message) });
    const [errorMessage, setErrorMessage] = useState('');
    const [LearningType, setLearningType] = useState(-1);
    const [excPassed, setExcPassed] = useState(false);
    const WordsStudyLevel = useMemo(() => new StudyLevelService(Lesson), [Lesson]);
    const { LearningElemts } = useLearningController({
        learningType: LearningType, setLearningType: setLearningType, addPoint: (index, points) => WordsStudyLevel.addTask(`${index} ${points}`),
        cards: Lesson.cards, onEscapePassed: setExcPassed, onClose: () => setLearningType(-1)
    });

    if (errorMessage) return <div>{errorMessage}</div>;

    useEffect(() => {
        if (LearningType == -1) {
            WordsStudyLevel.applyTasks();
            setUpdateFlag(prev => prev + 1);
        }
    }, [LearningType])

    return (
        <div className={style.lesson}>
            {LearningType == -1 ?
                <div>
                    <Header className={style.header} title={Lesson.title} description={Lesson.description} />
                    <LearningButons setLearningType={setLearningType} />
                    <Words cards={Lesson.cards} />
                </div> :
                <div>
                    {LearningElemts}
                    <CloseButton onClick={() => setLearningType(-1)} onPassed={excPassed} setOnPassed={setExcPassed} />
                </div>
            }
            {isLoad && <FullScreenLoadingAnimation backgroundStyle={{ backdropFilter: 'blur(0.6vh)', background: '#0a112873' }} />}
        </div>
    )
}

export default Lesson
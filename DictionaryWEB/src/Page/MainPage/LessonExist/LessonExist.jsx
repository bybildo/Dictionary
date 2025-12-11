import { useState, useEffect } from 'react';
import style from './style.module.css';
import { useNavigate } from 'react-router-dom';
import { SvgColumn1, SvgColumn2, SvgColumn3 } from '@components/svgs/index.js';
import Lessons from './Lessons/Lessons.jsx';

function LessonExist() {
    const navigate = useNavigate();
    const [columnLength, setColumnLength] = useState(1);

    return (
        <div className={style.LessonExist}>
            <div className={style.header}>
                <div className={style.addButton} onClick={() => navigate('/AddLesson')}><p>+</p></div>
                <div className={style.progress}> </div>
            </div>
            <div className={style.columnLessons}>
                <SvgColumn1 onClick={() => setColumnLength(1)} width={'6.2vw'} fillOpacity={columnLength === 1 ? 0.5 : 0.3} />
                <SvgColumn2 onClick={() => setColumnLength(2)} fillOpacity={columnLength === 2 ? 0.5 : 0.3} />
                <SvgColumn3 onClick={() => setColumnLength(3)} fillOpacity={columnLength === 3 ? 0.5 : 0.3} />
            </div>
            <Lessons columnLength={columnLength} setColumnLength={setColumnLength} />
        </div>
    );
}

export default LessonExist;

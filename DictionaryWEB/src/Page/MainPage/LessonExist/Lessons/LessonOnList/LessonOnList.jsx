import style from './style.module.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LessonOnList({ title, description, cardsLength, author, id }) {
    const navigate = useNavigate();
    const [ShowDescription, setShowDescription] = useState(false);
    const descRef = useRef(null);

    const handleRightClick = (event) => {
        event.preventDefault();
        if (event.button == 2) {
            setShowDescription(!ShowDescription);
        }
    };

    const descActiveStyle = {
        maxHeight: `${descRef.current?.scrollHeight}px`,
        marginBottom: '0.4vh',
    }

    return (
        <div className={style.lesson} onClick={() => navigate(`/Lesson/${id}`)} onContextMenu={handleRightClick}>
            <h1 className={style.title}>{title}</h1>
            <p ref={descRef} className={style.description} style={ShowDescription ? descActiveStyle : {}}>{description}</p>
            <p className={style.additionalInformation}>{`${cardsLength} ${cardsLength > 1 ? 'cards' : 'card'} • Author: ${author}`}</p>
        </div>
    );
}

export default LessonOnList
import { useEffect, useRef, useState } from 'react';
import style from './style.module.css'

function Header({ title = '', description = '' }) {
    const descRef = useRef(null);
    const [ShowDescription, setShowDescription] = useState(false);

    const handleRightClick = (event) => {
        event.preventDefault();
        setShowDescription(!ShowDescription);
    };

    const descActiveStyle = {
        maxHeight: `calc(${descRef.current?.scrollHeight}px + 3.5vh)`,
        marginBottom: '2vh',
        paddingTop: '1.5vh',
        paddingBottom: '1.7vh',
    }

    useEffect(() => {
        if (description.length == 0) setShowDescription(false);
    }, [ShowDescription]);

    return (
        <div className={style.header} onMouseLeave={() => setShowDescription(false)} >
            <h1 onContextMenu={handleRightClick} onClick={() => setShowDescription(!ShowDescription)} className={style.title}>{title}</h1>
            <p ref={descRef} className={style.description} style={ShowDescription ? descActiveStyle : {}}>{description}</p>
        </div>
    );
}

export default Header
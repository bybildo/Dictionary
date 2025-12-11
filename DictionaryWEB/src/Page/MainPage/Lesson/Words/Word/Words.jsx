import style from './style.module.css'

function Word({ term, definition, currentRow, studyLevel }) {
    const rowStyles = {
        1: style.row1,
        2: style.row2,
        3: style.row3,
    };

    return (
        <div className={style.wordContainer}>
            <div className={`${style.word} ${rowStyles[currentRow] || ''}`}>
                <div className={style.term}>{term}</div>
                <div className={style.separator}></div>
                <div className={style.definition}>{definition}</div>
            </div>
            <div className={style.studyLevel} style={{ "--percent": studyLevel }}>
                <p>{studyLevel}</p> 
            </div>
        </div>
    )
}

export default Word
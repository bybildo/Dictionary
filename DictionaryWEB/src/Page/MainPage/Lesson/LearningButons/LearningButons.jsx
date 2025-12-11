import style from './style.module.css'

function LearningButons({ setLearningType }) {
    return (
        <div className={style.learningButon}>
            <div className={style.row1}>
                <p onClick={() => setLearningType(0)}>Memorization</p>
            </div>
            <div className={style.row2}>
                <p onClick={() => setLearningType(1)}>Flashcards</p>
                <p onClick={() => setLearningType(2)}>Chose a term</p>
                <p onClick={() => setLearningType(3)}>Сhose a definition</p>
            </div>
            <div className={style.row3}>
                <p onClick={() => setLearningType(4)}>Compile words audio</p>
                <p onClick={() => setLearningType(5)}>Chose a translation audio</p>
                <p onClick={() => setLearningType(6)}>Compile words</p>
            </div>
        </div >
    )
}

export default LearningButons
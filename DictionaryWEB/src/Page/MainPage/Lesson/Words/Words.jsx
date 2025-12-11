import { useEffect, useState } from 'react';
import style from './style.module.css'
import Word from './Word/Words.jsx';
import { SvgRow1, SvgRow2, SvgRow3 } from '@components/svgs/index.js';

function Words({ cards }) {
    const [currentRow, setCurrentRow] = useState(1);

    return (
        <div className={style.words}>
            <div className={style.header}>
                <h1>Words</h1>
                <div className={style.rowWords}>
                    <SvgRow1 onClick={() => setCurrentRow(1)} fillOpacity={currentRow === 1 ? 0.5 : 0.3} />
                    <SvgRow2 onClick={() => setCurrentRow(2)} fillOpacity={currentRow === 2 ? 0.5 : 0.3} />
                    <SvgRow3 onClick={() => setCurrentRow(3)} fillOpacity={currentRow === 3 ? 0.5 : 0.3} />
                </div>
            </div>
            {cards && cards.map((card, index) => (
                <Word key={index} term={card.term} definition={card.definition} currentRow={currentRow} studyLevel={card.studyLevel}/>
            ))}
        </div>
    )
}

export default Words
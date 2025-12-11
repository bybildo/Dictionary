import { useState, useEffect } from 'react';
import style from './style.module.css';
import languageJSON from '../../../../assets/data/language.json';

function ChooseLanguage({ onChange, onClose }) {
    const [search, setSearch] = useState('');
    const [filteredLanguages, setFilteredLanguages] = useState([{ code: '', name: '' }]);
    const languages = Object.entries(languageJSON);

    useEffect(() => {
        const names = languages
            .map(([key, value]) => {
                const lowerSearch = search.length > 0 ? search.toLowerCase() : 'en';

                if (key.toLowerCase().includes(lowerSearch)) {
                    return { code: key, name: value.name };
                } else if (value.nativeName.toLowerCase().includes(lowerSearch)) {
                    return { code: key, name: value.nativeName };
                } else if (value.name.toLowerCase().includes(lowerSearch)) {
                    return { code: key, name: value.name };
                } else {
                    return null;
                }
            })
            .filter(Boolean).slice(0, 3);
        setFilteredLanguages(names);
    }, [search]);

    const handleLanguageClick = (code, name) => {
        onChange({ code: code, name: name });
        onClose();
    }

    return (
        <div className={style.chooseLanguage}>
            <h1 className={style.title}>Choose the language to which the translation will be made</h1>
            <div className={style.languages}>
                <input type="text" placeholder="Search" className={style.search} onChange={(e) => setSearch(e.target.value)} />
                {filteredLanguages.map((lang, index) => (
                    <div key={index} className={style.language} onClick={() => handleLanguageClick(lang.code, lang.name)}>{lang.name}</div>
                ))}
            </div>
        </div>
    )
}

export default ChooseLanguage
import { useEffect } from 'react';
import { translateText } from '@services/translatorService';

export function useAutoTranslate({ language, isEnabled, words, setWords }) {
    useEffect(() => {
        if (!isEnabled || language.code === '') return;

        const filtered = words.filter(word => word.term && !word.definition);
        if (filtered.length === 0) return;

        const texts = filtered.map(w => w.term);
        const ids = filtered.map(w => w.id);

        const fetchTranslations = async () => {
            try {
                const response = await translateText(texts, language.code, ids);

                setWords(prev =>
                    prev.map(word => {
                        const match = response.find(r => r.id === word.id);
                        if (match && match.translations?.length) {
                            const originalFirstChar = word.term.charAt(0);
                            const translation = match.translations[0].text;

                            const formattedTranslation =
                                originalFirstChar === originalFirstChar.toUpperCase()
                                    ? translation.charAt(0).toUpperCase() + translation.slice(1)
                                    : translation.charAt(0).toLowerCase() + translation.slice(1);

                            return { ...word, definition: formattedTranslation };
                        } else {
                            return word;
                        }
                    })
                );
            } catch (err) {
                console.error('Translation fetch failed:', err);
            }
        };

        fetchTranslations();
    }, [language, isEnabled]);
}

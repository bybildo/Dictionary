import { useEffect, useState } from "react";
import style from "./style.module.css";

export default function LocalVoiceSetting({ onClose, onSelectVoice, selectVoice }) {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(selectVoice || null);

    useEffect(() => {
        const loadVoices = () => {
            const v = window.speechSynthesis.getVoices();
            setVoices(v);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const handleChange = (e) => {
        const voice = voices.find((v) => v.name === e.target.value);
        setSelectedVoice(voice);
        onSelectVoice(voice);
        onClose();
    };

    return (
        <>
            <div className={style.background} onClick={onClose}></div>
            <div className={style.localVoiceSetting}>
                <h1>Choose a voiceover voice</h1>
                <select
                    className={style.select}
                    onChange={handleChange}
                    size={4}
                    value={selectedVoice?.name || ""}
                >
                    {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name}
                        </option>
                    ))}
                </select>
                <button onClick={onClose} style={{ marginTop: "2vh" }}>
                    Close
                </button>
            </div>
        </>
    );
}

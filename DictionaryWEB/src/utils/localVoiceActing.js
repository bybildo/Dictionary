export function toSoundLocale(text, localVoice, isPlayAudio, setIsPlayAudio) {
    if ("speechSynthesis" in window) {
        if (isPlayAudio) {
            window.speechSynthesis.cancel();
            setIsPlayAudio(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        if (localVoice) {
            utterance.voice = localVoice;
            utterance.lang = localVoice.lang;
        }

        utterance.onstart = () => setIsPlayAudio(true);
        utterance.onend = () => setIsPlayAudio(false);
        utterance.onerror = () => setIsPlayAudio(false);
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Your browser does not support speech synthesis (SpeechSynthesis API)");
    }
}

export function LoadLocalDefaultVoice(SetVoice) {
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith("en"));
    if (englishVoice) {
        SetVoice(englishVoice);
    }
}
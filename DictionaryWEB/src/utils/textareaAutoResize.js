export function textareaAutoResize(ref) {
        const textarea = ref.current;
        if (!textarea) return;

        const adjustHeight = () => {
            textarea.style.height = 'auto';
            const vhHeight = (textarea.scrollHeight / window.innerHeight) * 100;
            textarea.style.height = `${vhHeight}vh`;
        };

        textarea.addEventListener('input', adjustHeight);
        window.addEventListener('resize', adjustHeight);
        adjustHeight();

        return () => {
            textarea.removeEventListener('input', adjustHeight);
            window.removeEventListener('resize', adjustHeight);
        };
}

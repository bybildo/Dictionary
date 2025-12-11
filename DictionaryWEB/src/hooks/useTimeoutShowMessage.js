import { useState, useEffect } from "react";

export const useTimeoutShowMessage = (milliseconds) => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (showMessage) {
            if (milliseconds <= 0) return;

            setTimeout(() => {
                setShowMessage(false);
            }, milliseconds);
        }
    }, [showMessage]);

    return { showMessage, setShowMessage };
}
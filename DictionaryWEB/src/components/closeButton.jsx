import '@styles/transformScale.css';
import { useEffect, useRef } from 'react';

export default function CloseButton({ onClick, passedStyle, onPassed, setOnPassed, divStyle, xStyle, ...props }) {
    const timerRef = useRef(null);

    useEffect(() => {
        if (onPassed) {
            timerRef.current = setTimeout(() => {
                setOnPassed(false);
                onClick();
            }, 1700);
        } else {
            clearTimeout(timerRef.current);
        }

        return () => clearTimeout(timerRef.current);
    }, [onPassed, onClick]);

    const styleForDiv = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '600',
        position: 'absolute',
        top: '7vh',
        left: '1.2vw',
        width: '5.5vh',
        height: '5.5vh',
        zIndex: 10,
        borderRadius: '100%',
        cursor: 'pointer',
        border: '0.3vh solid #aad2e688',
        overflow: 'hidden',
        ...divStyle
    }

    const styleForX = {
        fontSize: '1.8vh',
        ...xStyle
    }

    const styleForPassed = {
        transition: onPassed ? 'all 1.6s ease-in-out' : 'all 0.7s ease-in-out',
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(50deg, #aad2e688 0%, #aad2e65d 100%)',
        marginBottom: onPassed ? '0vh' : '-11vh',
        ...onPassed
    }

    return (
        <div className='transformScale' {...props} style={styleForDiv} onClick={onClick}>
            <div style={styleForPassed}></div>
            <p style={styleForX}>Esc</p>
        </div>
    );
}
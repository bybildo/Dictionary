import { CiTextAlignCenter } from "react-icons/ci";

export default function ShowMessage({ message, style }) {
    const defaultStyle = {
        position: 'fixed',
        top: '20vh',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxShadow: '0 0.2vh 1.3vh rgba(0, 0, 0, 0.356)',
        border: '0.3vh dashed #A9D6E5',
        borderRadius: '1vh',
        zIndex: '1000',
        fontSize: '4vh',
        background: '#013363',
        padding: '1vh 1.5vw',
        fontFamily: "Poppins",
        fontWeight: '400',
        userSelect: 'none',
        color: '#A9D6E5',
        maxWidth: '50vw',
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease-in-out',
        textAlign: 'center'
    };

    return <p style={{ ...defaultStyle, ...style }}>{message}</p>
}
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animation/loading.json";

export default function FullScreenLoadingAnimation({ backgroundStyle, loadingAnimationStyle }) {
    const containerStyle = {
        position: 'fixed',
        zIndex: '100',
        width: '100vw',
        height: '100vh',
        left: 0,
        top: 0,
        background: '#0A1128',
        ...backgroundStyle
    }

    const animationStyle =
    {
        position: 'fixed',
        width: '15vw',
        height: '15vh',
        top: '35vh',
        left: '42.5vw',
        ...loadingAnimationStyle
    }


    return (
        <div style={containerStyle}>
            <div style={animationStyle}>
                <Lottie animationData={loadingAnimation} />
            </div>;
        </div>);
}
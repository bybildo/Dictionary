import { useState } from 'react'
import style from './style.module.css'
import { GoPerson } from "react-icons/go";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


function Header() {
    const navigate = useNavigate();
    const [cooldown, setCooldown] = useState(false);
    const [bubbles, setBubbles] = useState([]);
    const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });
    const [phrase, setPhrase] = useState(motivationPhrases[Math.floor(Math.random() * motivationPhrases.length)]);

    const LogoRightClick = (e) => {
        e.preventDefault();
        if (cooldown) return;
        setCooldown(true);

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setBubblePos({ x, y });

        const newBubbles = Array.from({ length: 25 }).map((_, i) => ({
            id: Math.random() + '-' + i,
            angle: Math.random() * 2 * Math.PI,
            distance: 40 + Math.random() * 30,
            size: 15 + Math.random() * 10,
            duration: 0.8 + Math.random() * 0.6,
        }));
        setBubbles(newBubbles);

        setTimeout(() => setBubbles([]), 1500);
        setTimeout(() => setPhrase(motivationPhrases[Math.floor(Math.random() * motivationPhrases.length)]), 400);
        setTimeout(() => setCooldown(false), 1500);
    };

    const dynamicVh = Math.max(2, 3.3 - phrase.length * 0.02);

    return (
        <div className={style.header}>
            <h1 className={style.logoText} onClick={() => navigate('/')} translate='no' onContextMenu={LogoRightClick} style={{ fontSize: `clamp(2vh, ${dynamicVh}vh, 3.3vh)` }}>
                {phrase}
                <span
                    className={style.bubblesContainer}
                    style={{
                        left: bubblePos.x,
                        top: bubblePos.y,
                    }}
                >
                    {bubbles.map(bubble => (
                        <span
                            key={bubble.id}
                            className={style.bubble}
                            style={{
                                '--angle': bubble.angle + 'rad',
                                '--distance': bubble.distance + 'px',
                                '--size': bubble.size + 'px',
                                '--duration': bubble.duration + 's',
                            }}
                        />
                    ))}
                </span>
            </h1>
            <div className={style.headerPanel}>
                <IoIosAddCircleOutline className={style.headerPanelElement} />
                <GoPerson className={style.headerPanelElement} />
            </div>
        </div>
    );
}

const motivationPhrases = [
    "Do it",
    "Come on, study your words. Now!",
    "Thinking of relaxing? WRONG. Time to learn vocabulary",
    "Do you really think you'll learn Chinese in a day? Then start now!",
    "Netflix can wait. Your flashcards can't",
    "You blink — someone else learns 10 words",
    "Rest? That’s for people who already know 7,000 words",
    "Procrastinate later. Study now",
    "Quit scrolling. Start learning",
    "One more word. Always one more word",
    "Study now, flex later",
    "You could be fluent... or just on TikTok again",
    "Do it. Now.",
    "Quit scrolling. Start learning",
    "One more word. Always one more word",
    "Stop dreaming, start memorizing",
    "Another episode? Nope. Another word",
    "Your brain’s begging for new words. Feed it",
    "You’re not tired. You’re just lazy. Study.",
    "Time’s ticking. Words are waiting",
    "You’re not done until you learn 10 more",
    "Less whining, more memorizing",
    "Your goals laugh at your excuses",
    "Break time’s over. Back to learning",
    "Oh, you ‘don’t feel like it’? Cute. Open the flashcards",
    "Your excuses are older than Confucius. Shut up and study.",
    "Your motivation is a lie. Discipline is real. Move.",
    "Your brain’s not ‘fried.’ It’s just allergic to effort",
    "Netflix won’t subtitle itself, dumbass. Learn the language",
    "Your competition isn’t sleeping. Neither should you. (Kidding. Sleep. But study first)",
    "Your phone’s a distraction. Smash it. (Or just learn a word)",
    "Stop reading this. GO.",
    "Oh, you ‘need a break’? How adorable. The flashcards aren’t going anywhere"
];

export default Header;
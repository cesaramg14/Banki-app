import React, { useEffect, useState } from "react";
import bgMorning1 from "../assets/bg-image-1.webp";
import bgMorning2 from "../assets/bg-image-2.webp";
import bgMorning3 from "../assets/bg-image-7.webp";
import bgAfternoon1 from "../assets/bg-image-3.webp";
import bgAfternoon2 from "../assets/bg-image-4.webp";
import bgAfternoon3 from "../assets/bg-image-8.webp";
import bgEvening1 from "../assets/bg-image-5.webp";
import bgEvening2 from "../assets/bg-image-6.webp";

const backgrounds: { [key: string]: string[] } = {
    morning: [bgMorning1, bgMorning2, bgMorning3],
    afternoon: [bgAfternoon1, bgAfternoon2, bgAfternoon3],
    evening: [bgEvening1, bgEvening2],
};

const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
};

const getBackgroundForDay = (): string => {
    const date = new Date();
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const hour = date.getHours();

    const uniqueKey = `${dayKey}`; // Reemplazar con `${dayKey}-${userId}` cuando ya tenga el usuario
    const hash = simpleHash(uniqueKey);

    let images;
    if (hour >= 8 && hour < 12) images = backgrounds.morning;
    else if (hour >= 12 && hour < 20) images = backgrounds.afternoon;
    else images = backgrounds.evening;

    return images[Math.abs(hash) % images.length];
};

interface BackgroundComponentProps {
    children?: React.ReactNode;
}

const BackgroundComponent: React.FC<BackgroundComponentProps> = ({ children }) => {
    const [background, setBackground] = useState<string>(getBackgroundForDay());

    useEffect(() => {
        const updateBackground = () => {
            const newBackground = getBackgroundForDay();
            if (newBackground !== background) {
                setBackground(newBackground);
            }
        };
        const interval = setInterval(updateBackground, 60000);
        updateBackground();
        return () => clearInterval(interval); 
    }, [background]);

    return (
        <div
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                margin: 0,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
            }}
        >
            <div style={{ minHeight: "100vh", position: "relative" }}>
                {children}
            </div>
        </div>
    );
};

export default BackgroundComponent;

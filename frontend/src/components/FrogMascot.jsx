import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const ACCESSORIES = ['', '🌸', '🎩', '👑', '🌟'];

export default function FrogMascot({ accessoryLevel = 0 }) {
    const [hovered, setHovered] = useState(false);
    const [squishing, setSquishing] = useState(false);
    const [pos, setPos] = useState({ x: 20, y: 20 }); // bottom-right %
    const ref = useRef(null);
    const accessory = ACCESSORIES[Math.min(accessoryLevel, ACCESSORIES.length - 1)];

    const handleMouseEnter = () => {
        setHovered(true);
        setSquishing(true);
        setTimeout(() => setSquishing(false), 400);
    };

    const handleClick = () => {
        setSquishing(true);
        setTimeout(() => setSquishing(false), 400);
    };

    return (
        <motion.div
            ref={ref}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
            drag
            dragConstraints={{ top: -400, left: -800, right: 0, bottom: 0 }}
            onDragEnd={(e, info) => {
                // Check if near edges and squish
                const el = ref.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const nearEdge =
                    rect.left < 15 || rect.right > window.innerWidth - 15 ||
                    rect.top < 15 || rect.bottom > window.innerHeight - 15;
                if (nearEdge) {
                    setSquishing(true);
                    setTimeout(() => setSquishing(false), 400);
                }
            }}
            whileHover={{ scale: 1.1 }}
            animate={squishing ? {
                scaleX: [1, 1.4, 0.8, 1],
                scaleY: [1, 0.6, 1.2, 1],
            } : {}}
            transition={squishing ? { duration: 0.4 } : {}}
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 100,
                cursor: 'grab',
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
            }}
        >
            {/* Accessory */}
            {accessory && (
                <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    style={{ fontSize: '20px', marginBottom: '-8px', zIndex: 1 }}
                >
                    {accessory}
                </motion.div>
            )}

            {/* Frog image - Pixelated CSS Art */}
            <div style={{ position: 'relative' }}>
                <motion.div
                    style={{
                        width: 'clamp(70px, 10vw, 110px)',
                        height: 'clamp(70px, 10vw, 110px)',
                        position: 'relative',
                        imageRendering: 'pixelated',
                        filter: hovered ? 'brightness(1.1)' : 'brightness(1)',
                        transition: 'filter 0.3s ease',
                    }}
                    animate={squishing ? {
                        scaleX: [1, 1.2, 0.9, 1],
                        scaleY: [1, 0.8, 1.1, 1],
                    } : hovered ? {
                        y: [0, -2, 0],
                    } : {}}
                    transition={squishing ? { duration: 0.4 } : hovered ? { repeat: Infinity, duration: 1 } : {}}
                >
                    {/* Frog Body - Pixelated */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: '#4CAF50',
                        borderRadius: '40% 40% 50% 50%',
                        border: '3px solid #2E7D32',
                        boxSizing: 'border-box',
                    }} />
                    
                    {/* Belly */}
                    <div style={{
                        position: 'absolute',
                        width: '70%',
                        height: '60%',
                        background: '#81C784',
                        borderRadius: '50%',
                        bottom: '5%',
                        left: '15%',
                        border: '2px solid #66BB6A',
                    }} />
                    
                    {/* Eyes */}
                    <div style={{
                        position: 'absolute',
                        width: '25%',
                        height: '25%',
                        background: 'white',
                        borderRadius: '50%',
                        border: '2px solid #2E7D32',
                        top: '20%',
                        left: '20%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            width: '50%',
                            height: '50%',
                            background: '#000',
                            borderRadius: '50%',
                        }} />
                    </div>
                    <div style={{
                        position: 'absolute',
                        width: '25%',
                        height: '25%',
                        background: 'white',
                        borderRadius: '50%',
                        border: '2px solid #2E7D32',
                        top: '20%',
                        right: '20%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            width: '50%',
                            height: '50%',
                            background: '#000',
                            borderRadius: '50%',
                        }} />
                    </div>
                    
                    {/* Cheeks (blush) */}
                    <div style={{
                        position: 'absolute',
                        width: '15%',
                        height: '15%',
                        background: '#FFB3BA',
                        borderRadius: '50%',
                        top: '35%',
                        left: '10%',
                        opacity: 0.7,
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '15%',
                        height: '15%',
                        background: '#FFB3BA',
                        borderRadius: '50%',
                        top: '35%',
                        right: '10%',
                        opacity: 0.7,
                    }} />
                    
                    {/* Mouth */}
                    <div style={{
                        position: 'absolute',
                        width: '30%',
                        height: '3px',
                        background: '#2E7D32',
                        borderRadius: '2px',
                        bottom: '30%',
                        left: '35%',
                    }} />
                    
                    {/* Feet */}
                    <div style={{
                        position: 'absolute',
                        width: '20%',
                        height: '15%',
                        background: '#4CAF50',
                        border: '2px solid #2E7D32',
                        borderRadius: '50%',
                        bottom: '-5%',
                        left: '20%',
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '20%',
                        height: '15%',
                        background: '#4CAF50',
                        border: '2px solid #2E7D32',
                        borderRadius: '50%',
                        bottom: '-5%',
                        right: '20%',
                    }} />
                </motion.div>
                {/* Hover tooltip */}
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            position: 'absolute',
                            bottom: '110%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--earth)',
                            color: 'var(--cream)',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            zIndex: 10,
                        }}
                    >
                        🐸 Drag me!
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

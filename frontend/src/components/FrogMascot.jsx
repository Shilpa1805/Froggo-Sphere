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

            {/* Frog image */}
            <div style={{ position: 'relative' }}>
                <img
                    src="/frogs/frog2.svg"
                    alt="Froggo mascot"
                    style={{
                        width: 'clamp(70px, 10vw, 110px)',
                        borderRadius: '50%',
                        border: '3px solid var(--sage)',
                        boxShadow: hovered
                            ? '0 0 20px rgba(135,169,107,0.6)'
                            : '0 4px 12px rgba(107,66,38,0.2)',
                        transition: 'box-shadow 0.3s ease',
                        display: 'block',
                    }}
                />
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

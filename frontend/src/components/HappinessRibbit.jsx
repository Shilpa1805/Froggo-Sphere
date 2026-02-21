import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomPun } from '../utils/puns';

export default function HappinessRibbit({ onSpawnBubble, antiGravity }) {
    const [bouncing, setBouncing] = useState(false);
    const [currentPun, setCurrentPun] = useState('');
    const [showLocal, setShowLocal] = useState(false);

    const handleRibbit = () => {
        const pun = getRandomPun();
        setCurrentPun(pun);
        setShowLocal(true);
        setBouncing(true);
        onSpawnBubble(pun);
        setTimeout(() => setBouncing(false), 600);
        setTimeout(() => setShowLocal(false), 3500);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <motion.button
                onClick={handleRibbit}
                animate={bouncing ? {
                    y: [0, -12, 4, -6, 0],
                    rotate: [0, -5, 5, -3, 0],
                } : {}}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.92 }}
                style={{
                    background: antiGravity
                        ? 'linear-gradient(135deg, #1f4a2a, #2d6a40)'
                        : 'linear-gradient(135deg, #87A96B, #6a8a52)',
                    color: 'var(--cream)',
                    border: `2px solid ${antiGravity ? 'var(--lily)' : 'transparent'}`,
                    borderRadius: '50px',
                    padding: '14px 28px',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    boxShadow: antiGravity
                        ? '0 0 20px rgba(168,213,162,0.3)'
                        : '0 4px 15px rgba(135,169,107,0.4)',
                    transition: 'all 0.4s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <motion.span
                    animate={bouncing ? { rotate: [0, 20, -20, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'inline-block', fontSize: '1.3rem' }}
                >
                    🐸
                </motion.span>
                Happiness Ribbit!
            </motion.button>

            {/* Local quick preview */}
            <AnimatePresence>
                {showLocal && (
                    <motion.div
                        className="speech-bubble"
                        initial={{ opacity: 0, scale: 0.7, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: -10 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 18px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--cream)',
                            border: '2px solid var(--sage)',
                            borderRadius: '16px',
                            padding: '12px 18px',
                            minWidth: '200px',
                            maxWidth: '280px',
                            textAlign: 'center',
                            boxShadow: '0 8px 24px rgba(107,66,38,0.2)',
                            zIndex: 150,
                            color: 'var(--earth)',
                            fontWeight: 700,
                            lineHeight: 1.5,
                            fontSize: '0.9rem',
                            whiteSpace: 'normal',
                        }}
                    >
                        {currentPun}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

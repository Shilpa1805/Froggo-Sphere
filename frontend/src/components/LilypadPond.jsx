import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lilypad from './Lilypad';

export default function LilypadPond({ messages }) {
    const [lilypads, setLilypads] = useState([]);
    const pondRef = useRef(null);
    const [pondDimensions, setPondDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Update pond dimensions
        const updateDimensions = () => {
            if (pondRef.current) {
                setPondDimensions({
                    width: pondRef.current.offsetWidth,
                    height: pondRef.current.offsetHeight
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        // Convert messages to lilypads with random positions
        const newLilypads = messages.map((msg, index) => {
            const angle = (index / messages.length) * Math.PI * 2;
            const radius = 100 + (index % 3) * 50; // Vary radius for visual interest
            const x = Math.cos(angle) * radius + (pondDimensions.width / 2 - 40);
            const y = Math.sin(angle) * radius * 0.6 + (pondDimensions.height / 2 - 40);

            return {
                id: msg.id,
                message: msg.text || msg.message,
                timestamp: msg.timestamp || Date.now(),
                position: { x, y }
            };
        });

        setLilypads(newLilypads);
    }, [messages, pondDimensions]);

    const handleLilypadClick = (lilypadData) => {
        console.log('Lilypad clicked:', lilypadData);
        // Could add additional functionality here
    };

    return (
        <div 
            ref={pondRef}
            style={{
                position: 'relative',
                width: '100%',
                height: messages.length > 0 ? '500px' : '400px',
                background: 'radial-gradient(ellipse at center, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(70, 130, 180, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.3)',
                border: '2px solid #5f9ea0',
            }}
        >
            {/* Water ripple effect */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, transparent 30%, rgba(255,255,255,0.1) 70%, transparent 100%)',
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Lilypads */}
            <AnimatePresence>
                {lilypads.map((lilypad) => (
                    <Lilypad
                        key={lilypad.id}
                        message={lilypad.message}
                        timestamp={lilypad.timestamp}
                        id={lilypad.id}
                        position={lilypad.position}
                        onClick={handleLilypadClick}
                    />
                ))}
            </AnimatePresence>

            {/* Empty state */}
            {lilypads.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: antiGravity ? '#a8d5a2' : 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    }}
                >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐸</div>
                    <div>Your pond is waiting for messages...</div>
                    <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>
                        Type a gratitude note to create a lilypad!
                    </div>
                </motion.div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Lilypad({ message, timestamp, id, position, onClick }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFloating, setIsFloating] = useState(false);

    useEffect(() => {
        // Start floating animation after a short delay
        const timer = setTimeout(() => setIsFloating(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleClick = () => {
        setIsExpanded(!isExpanded);
        onClick && onClick({ message, timestamp, id });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateMessage = (text, maxLength = 30) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <motion.div
            initial={{ 
                scale: 0, 
                rotate: Math.random() * 20 - 10,
                x: position?.x || 0,
                y: position?.y || 0
            }}
            animate={{ 
                scale: 1, 
                rotate: 0,
                x: position?.x || 0,
                y: position?.y || 0
            }}
            transition={{ 
                type: "spring", 
                stiffness: 0.5, 
                damping: 0.8,
                duration: 0.8
            }}
            whileHover={{ 
                scale: isExpanded ? 1.05 : 1.1,
                rotate: Math.random() * 5 - 2.5
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            style={{
                position: 'absolute',
                cursor: 'pointer',
                zIndex: isExpanded ? 50 : 10,
            }}
        >
            {/* Floating animation */}
            {isFloating && (
                <motion.div
                    animate={{
                        y: [0, -8, -4, -8, 0],
                        rotate: [0, 2, -1, 2, 0]
                    }}
                    transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* Lily pad leaf */}
                    <motion.div
                        style={{
                            width: isExpanded ? '220px' : '90px',
                            height: isExpanded ? '220px' : '90px',
                            background: `
                                radial-gradient(ellipse at 30% 30%, #7CB342, #558B2F),
                                linear-gradient(135deg, #689F38 0%, #558B2F 50%, #33691E 100%)
                            `,
                            borderRadius: '50% 45% 50% 45% / 55% 50% 45% 50%',
                            boxShadow: `
                                0 6px 20px rgba(0, 0, 0, 0.3),
                                inset 0 2px 8px rgba(139, 195, 74, 0.4),
                                inset 0 -2px 8px rgba(46, 125, 50, 0.3)
                            `,
                            border: '1px solid #2E7D32',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.4s ease',
                            transform: 'rotate(-5deg)',
                        }}
                    >
                        {/* Leaf veins */}
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: `
                                linear-gradient(45deg, transparent 48%, rgba(46, 125, 50, 0.2) 48%, rgba(46, 125, 50, 0.2) 52%, transparent 52%),
                                linear-gradient(135deg, transparent 48%, rgba(46, 125, 50, 0.15) 48%, rgba(46, 125, 50, 0.15) 52%, transparent 52%),
                                radial-gradient(ellipse at center, transparent 30%, rgba(46, 125, 50, 0.1) 70%)
                            `,
                            borderRadius: 'inherit',
                        }} />

                        {/* Leaf detail lines */}
                        <div style={{
                            position: 'absolute',
                            width: '80%',
                            height: '2px',
                            background: 'rgba(46, 125, 50, 0.3)',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(45deg)',
                        }} />
                        <div style={{
                            position: 'absolute',
                            width: '80%',
                            height: '2px',
                            background: 'rgba(46, 125, 50, 0.3)',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-45deg)',
                        }} />

                        {/* Natural leaf edge variation */}
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(ellipse at 70% 70%, transparent 60%, rgba(46, 125, 50, 0.1) 100%)',
                            borderRadius: '50% 40% 50% 40% / 60% 50% 40% 50%',
                        }} />

                        {/* Message text */}
                        <motion.div
                            animate={{
                                scale: isExpanded ? 1 : 0.8,
                                opacity: isExpanded ? 1 : 0.9
                            }}
                            style={{
                                color: '#FFFFFF',
                                fontSize: isExpanded ? '14px' : '10px',
                                fontWeight: '600',
                                textAlign: 'center',
                                padding: isExpanded ? '25px' : '10px',
                                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                                maxWidth: '85%',
                                wordWrap: 'break-word',
                                zIndex: 2,
                                position: 'relative',
                                lineHeight: 1.3,
                            }}
                        >
                            {isExpanded ? message : truncateMessage(message)}
                        </motion.div>

                        {/* Timestamp - only visible when expanded */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: '500',
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {formatDate(timestamp)}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
}

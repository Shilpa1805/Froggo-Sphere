import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const PUNS = [
    "What do you call a frog with no legs? Unhoppy! 🐸",
    "Why are frogs so happy? They eat whatever bugs them! 🐛",
    "Time flies like an arrow, fruit flies like a banana... but frogs just hop! 🕰️",
    "What's a frog's favorite candy? Lollihops! 🍭",
    "Why did the frog read the book? He wanted to be a well-read amphibian! 📚",
    "What do you get when you cross a frog with a rabbit? A bunny that hops higher! 🐰",
    "Frogs are great at poker because they're good at bluffing! 🎰",
    "Why don't frogs wear shoes? They prefer to go barefoot! 👣",
    "What's a frog's favorite type of music? Hip-hop! 🎵",
    "Frogs never get lost because they always know which way to hop! 🧭"
];

const MOTIVATIONS = [
    "You're toad-ally amazing! Keep going! 🌟",
    "Every small hop counts towards your big leap! 🐸",
    "You're making ripples of positive change! 💚",
    "Your gratitude is growing like a beautiful lily pad! 🌸",
    "Keep jumping, your best pond is ahead! 🏞️",
    "You're un-frog-gettable! Stay amazing! ✨",
    "Your kindness is making the world a better pond! 🌍",
    "Hop into today with confidence! You've got this! 💪",
    "Your positive energy is like sunshine on a lily pad! ☀️",
    "You're ribbiting with potential! Keep shining! 🌟"
];

export default function Dashboard({ user, onLogout }) {
    const [showPondView, setShowPondView] = useState(false);
    const [lilypadMessages, setLilypadMessages] = useState([]);
    const [notification, setNotification] = useState('');
    const [pun, setPun] = useState('');
    const [motivation, setMotivation] = useState('');

    // Load stored lilypads on component mount
    useEffect(() => {
        const storedLilypads = localStorage.getItem(`lilypads_${user?.username || 'guest'}`);
        if (storedLilypads) {
            try {
                setLilypadMessages(JSON.parse(storedLilypads));
            } catch (e) {
                console.error('Error loading stored lilypads:', e);
            }
        }
    }, [user?.username]);

    // Save lilypads to localStorage whenever they change
    useEffect(() => {
        if (lilypadMessages.length > 0) {
            localStorage.setItem(`lilypads_${user?.username || 'guest'}`, JSON.stringify(lilypadMessages));
        }
    }, [lilypadMessages, user?.username]);

    // Special welcome message for Olisa
    useEffect(() => {
        if (user?.username === 'olisa') {
            const timer = setTimeout(() => {
                setNotification("I'm so proud of you! Here's a lil gift from me love, Shilpa 💚");
                // Also show in console for debugging
                console.log("Olisa special message triggered!");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [user?.username]);

    // Generate random pun
    const generatePun = useCallback(() => {
        const randomPun = PUNS[Math.floor(Math.random() * PUNS.length)];
        setPun(randomPun);
        setNotification(randomPun);
        setTimeout(() => setNotification(''), 5000);
    }, []);

    // Generate random motivation
    const generateMotivation = useCallback(() => {
        const randomMotivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
        setMotivation(randomMotivation);
        setNotification(randomMotivation);
        setTimeout(() => setNotification(''), 5000);
    }, []);

    const handleNoteSubmit = useCallback(async (text) => {
        const newMessage = {
            id: Date.now(),
            text: text,
            timestamp: Date.now()
        };
        setLilypadMessages(prev => [...prev, newMessage]);
        
        // Randomly show pun or motivation after adding a message
        if (Math.random() > 0.5) {
            setTimeout(() => generatePun(), 1000);
        } else {
            setTimeout(() => generateMotivation(), 1000);
        }
    }, [generatePun, generateMotivation]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e8f5e9 0%, #f5f5dc 50%, #c8e6c9 100%)',
            padding: '20px',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
            }}>
                <div>
                    <h1 style={{
                        fontSize: '24px',
                        color: '#6B4423',
                        marginBottom: '8px',
                    }}>
                        🐸 Leap of Faith
                    </h1>
                    <p style={{
                        color: '#4682B4',
                        fontWeight: 600,
                    }}>
                        Hey {user?.username}! Welcome to the pond!
                    </p>
                </div>
                <button
                    onClick={onLogout}
                    style={{
                        background: 'none',
                        border: '1px solid #8FBC8F',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        color: '#556B2F',
                        fontWeight: 600,
                    }}
                >
                    🚪 Hop Out
                </button>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setShowPondView(!showPondView)}
                    style={{
                        background: showPondView 
                            ? 'linear-gradient(135deg, #4682B4, #8FBC8F)'
                            : 'linear-gradient(135deg, #8FBC8F, #556B2F)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '12px 20px',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    {showPondView ? '📝 Back to Writing' : '🌸 View My Pond'}
                </button>
                
                <button
                    onClick={generatePun}
                    style={{
                        background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                        color: '#8B4513',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '12px 20px',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    🎭 Tell Me a Pun
                </button>
                
                <button
                    onClick={generateMotivation}
                    style={{
                        background: 'linear-gradient(135deg, #FFE4B5, #FFD700)',
                        color: '#8B4513',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '12px 20px',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    ✨ Motivate Me
                </button>
            </div>

            {/* Main content */}
            {!showPondView ? (
                <div style={{ 
                    background: 'rgba(245,245,220,0.9)',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '2px solid #8FBC8F',
                    maxWidth: '600px',
                }}>
                    <h2 style={{
                        fontSize: '18px',
                        color: '#6B4423',
                        marginBottom: '16px',
                    }}>
                        🌿 The Gratitude Pond
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#4682B4',
                        marginBottom: '16px',
                    }}>
                        What are you grateful for today?
                    </p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const text = formData.get('gratitude');
                        if (text?.trim()) {
                            handleNoteSubmit(text.trim());
                            e.target.reset();
                        }
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <textarea
                            name="gratitude"
                            rows={3}
                            placeholder="Today I'm grateful for..."
                            style={{
                                resize: 'none',
                                padding: '12px',
                                border: '2px solid #8FBC8F',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                background: 'linear-gradient(135deg, #8FBC8F, #556B2F)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            🌸 Release to the Pond
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{ 
                    background: 'rgba(135,206,235,0.9)',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '2px solid #4682B4',
                    maxWidth: '800px',
                    minHeight: '400px',
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        color: '#1E90FF',
                        marginBottom: '16px',
                        textAlign: 'center',
                    }}>
                        🌸 Your Personal Pond 🌸
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: '#4682B4',
                        textAlign: 'center',
                        marginBottom: '24px',
                    }}>
                        You have {lilypadMessages.length} message{lilypadMessages.length !== 1 ? 's' : ''} floating in your pond
                    </p>
                    
                    { lilypadMessages.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#4682B4',
                            fontSize: '16px',
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐸</div>
                            <div>Your pond is waiting for messages...</div>
                            <div style={{ fontSize: '14px', marginTop: '8px' }}>
                                Type a gratitude note to create a lilypad!
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '400px',
                        }}>
                            {lilypadMessages.map((msg, index) => {
                                // Random position and animation for each lilypad
                                const randomX = 10 + (index * 15) % 70;
                                const randomY = 10 + (index * 23) % 60;
                                const randomDelay = index * 0.5;
                                const randomDuration = 3 + (index % 3);
                                const randomSize = 0.8 + (index % 4) * 0.1;
                                
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ 
                                            opacity: 0, 
                                            scale: 0,
                                            x: 0,
                                            y: 0
                                        }}
                                        animate={{ 
                                            opacity: 1, 
                                            scale: randomSize,
                                            x: [0, 5, -5, 0],
                                            y: [0, -8, -3, 0],
                                            rotate: [0, 3, -3, 0]
                                        }}
                                        transition={{ 
                                            opacity: { duration: 0.5, delay: randomDelay },
                                            scale: { duration: 0.8, delay: randomDelay },
                                            x: { 
                                                repeat: Infinity, 
                                                duration: randomDuration,
                                                ease: "easeInOut"
                                            },
                                            y: { 
                                                repeat: Infinity, 
                                                duration: randomDuration * 0.7,
                                                ease: "easeInOut"
                                            },
                                            rotate: { 
                                                repeat: Infinity, 
                                                duration: randomDuration * 1.2,
                                                ease: "easeInOut"
                                            }
                                        }}
                                        style={{
                                            position: 'absolute',
                                            left: `${randomX}%`,
                                            top: `${randomY}%`,
                                            width: '120px',
                                            height: '120px',
                                        }}
                                        whileHover={{
                                            scale: 1.1,
                                            zIndex: 10,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        {/* Realistic lilypad shape */}
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'relative',
                                        }}>
                                            {/* Main lilypad body */}
                                            <div style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                background: 'radial-gradient(ellipse at 30% 30%, #90EE90, #228B22)',
                                                borderRadius: '50% 45% 50% 45% / 55% 50% 45% 50%',
                                                border: '2px solid #1F5F1F',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.3)',
                                            }} />
                                            
                                            {/* Leaf vein */}
                                            <div style={{
                                                position: 'absolute',
                                                width: '2px',
                                                height: '60%',
                                                background: 'linear-gradient(to bottom, #1F5F1F, transparent)',
                                                left: '50%',
                                                top: '20%',
                                                transform: 'translateX(-50%) rotate(15deg)',
                                            }} />
                                            
                                            {/* Cross veins */}
                                            <div style={{
                                                position: 'absolute',
                                                width: '40%',
                                                height: '1px',
                                                background: 'linear-gradient(to right, transparent, #1F5F1F, transparent)',
                                                left: '30%',
                                                top: '40%',
                                                transform: 'rotate(-20deg)',
                                            }} />
                                            <div style={{
                                                position: 'absolute',
                                                width: '40%',
                                                height: '1px',
                                                background: 'linear-gradient(to right, transparent, #1F5F1F, transparent)',
                                                right: '30%',
                                                top: '60%',
                                                transform: 'rotate(15deg)',
                                            }} />
                                            
                                            {/* Message text */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                color: 'white',
                                                textAlign: 'center',
                                                fontSize: '10px',
                                                fontWeight: '600',
                                                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                                maxWidth: '80px',
                                                lineHeight: '1.2',
                                                padding: '4px',
                                            }}>
                                                {msg.text.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text}
                                            </div>
                                            
                                            {/* Timestamp hint */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '5px',
                                                right: '5px',
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '8px',
                                                fontWeight: '500',
                                            }}>
                                                {new Date(msg.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Kawaii Frog Mascot */}
            <motion.div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 100,
                    cursor: 'pointer',
                }}
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                }}
                whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 }
                }}
                onClick={() => {
                    const messages = ['Ribbit! 🐸', 'Happy hopping! 🌸', 'You\'re amazing! ✨', 'Keep smiling! 😊'];
                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    setNotification(randomMessage);
                    setTimeout(() => setNotification(''), 3000);
                }}
            >
                <div style={{
                    width: '80px',
                    height: '80px',
                    position: 'relative',
                }}>
                    {/* Frog body */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #98FB98, #90EE90)',
                        borderRadius: '50% 50% 45% 45%',
                        border: '3px solid #228B22',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 -2px 8px rgba(255,255,255,0.5)',
                    }} />
                    
                    {/* Belly */}
                    <div style={{
                        position: 'absolute',
                        width: '70%',
                        height: '60%',
                        background: 'linear-gradient(135deg, #F0FFF0, #E6FFE6)',
                        borderRadius: '50%',
                        bottom: '5%',
                        left: '15%',
                        border: '2px solid #90EE90',
                    }} />
                    
                    {/* Big cute eyes */}
                    <div style={{
                        position: 'absolute',
                        width: '25%',
                        height: '25%',
                        background: 'white',
                        borderRadius: '50%',
                        border: '2px solid #228B22',
                        top: '20%',
                        left: '20%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                        <div style={{
                            width: '60%',
                            height: '60%',
                            background: '#000',
                            borderRadius: '50%',
                            position: 'relative',
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '30%',
                                height: '30%',
                                background: 'white',
                                borderRadius: '50%',
                                top: '20%',
                                left: '20%',
                            }} />
                        </div>
                    </div>
                    <div style={{
                        position: 'absolute',
                        width: '25%',
                        height: '25%',
                        background: 'white',
                        borderRadius: '50%',
                        border: '2px solid #228B22',
                        top: '20%',
                        right: '20%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                        <div style={{
                            width: '60%',
                            height: '60%',
                            background: '#000',
                            borderRadius: '50%',
                            position: 'relative',
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '30%',
                                height: '30%',
                                background: 'white',
                                borderRadius: '50%',
                                top: '20%',
                                left: '20%',
                            }} />
                        </div>
                    </div>
                    
                    {/* Cute blush cheeks */}
                    <div style={{
                        position: 'absolute',
                        width: '20%',
                        height: '15%',
                        background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                        borderRadius: '50%',
                        top: '35%',
                        left: '5%',
                        opacity: 0.8,
                        boxShadow: '0 2px 4px rgba(255,182,193,0.5)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '20%',
                        height: '15%',
                        background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                        borderRadius: '50%',
                        top: '35%',
                        right: '5%',
                        opacity: 0.8,
                        boxShadow: '0 2px 4px rgba(255,182,193,0.5)',
                    }} />
                    
                    {/* Cute smile */}
                    <div style={{
                        position: 'absolute',
                        width: '30%',
                        height: '8px',
                        background: '#228B22',
                        borderRadius: '0 0 20px 20px',
                        bottom: '25%',
                        left: '35%',
                        border: '2px solid #228B22',
                        borderTop: 'none',
                    }} />
                    
                    {/* Little crown/accessory */}
                    <div style={{
                        position: 'absolute',
                        width: '40%',
                        height: '15%',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        borderRadius: '50% 50% 0 0',
                        top: '-8%',
                        left: '30%',
                        border: '2px solid #FF8C00',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            background: '#FF1493',
                            borderRadius: '50%',
                            boxShadow: '0 0 4px #FF1493',
                        }} />
                    </div>
                    
                    {/* Little feet */}
                    <div style={{
                        position: 'absolute',
                        width: '25%',
                        height: '15%',
                        background: 'linear-gradient(135deg, #98FB98, #90EE90)',
                        border: '2px solid #228B22',
                        borderRadius: '50%',
                        bottom: '-5%',
                        left: '15%',
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '25%',
                        height: '15%',
                        background: 'linear-gradient(135deg, #98FB98, #90EE90)',
                        border: '2px solid #228B22',
                        borderRadius: '50%',
                        bottom: '-5%',
                        right: '15%',
                    }} />
                </div>
            </motion.div>

            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#6B4423',
                    color: '#F5DEB3',
                    padding: '12px 24px',
                    borderRadius: '20px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                }}>
                    {notification}
                </div>
            )}
        </div>
    );
}

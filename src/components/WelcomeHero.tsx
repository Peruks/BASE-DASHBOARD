import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import '../styles/WelcomeHero.css';

const QUOTES = [
    "The future of money is programmable.",
    "Blockchain is the tech. Crypto is the movement.",
    "Don't trust, verify.",
    "Web3 is about ownership.",
    "Decentralization is the new standard.",
    "Code is law.",
    "Building the internet of value.",
    "Innovation distinguishes between a leader and a follower.",
    "The best way to predict the future is to invent it."
];

export const WelcomeHero: React.FC = () => {
    const [greeting, setGreeting] = useState('');
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setQuote(randomQuote);
    }, []);

    return (
        <motion.div
            className="welcome-hero"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="hero-content">
                <motion.div
                    className="greeting-section"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h1 className="greeting-text">
                        {greeting}, <span className="explorer-text">Explorer</span>
                        <motion.span
                            className="wave-emoji"
                            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
                            style={{ display: 'inline-block', marginLeft: '10px' }}
                        >
                            👋
                        </motion.span>
                    </h1>
                    <p className="hero-subtitle">Your onchain journey, visualized.</p>
                </motion.div>

                <motion.div
                    className="quote-section"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div className="quote-icon">
                        <Quote size={16} />
                    </div>
                    <p className="quote-text">"{quote}"</p>
                </motion.div>
            </div>

            <div className="hero-background-glow" />
        </motion.div>
    );
};

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <motion.div
            className={`glass-card ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {title && <h3 className="card-title">{title}</h3>}
            {children}
        </motion.div>
    );
};

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';

const FlowArrow = ({ isActive }) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative w-16 h-8 flex items-center">
      {/* Base line with increased thickness */}
      <div 
        className={`absolute w-full h-1 ${
          theme === 'dark' ? 'bg-blue-400/40' : 'bg-blue-500/40'
        }`}
      />
      
      {/* Animated line - increased opacity */}
      <motion.div 
        className={`absolute h-1 ${
          theme === 'dark' ? 'bg-blue-400/90' : 'bg-blue-500/90'
        }`}
        initial={{ width: "20%", x: -20, opacity: 0 }}
        animate={{
          x: [0, 50],
          opacity: [.3, 0.8, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Arrowhead with increased stroke width */}
      <svg 
        className={`absolute -right-1 w-4 h-4 ${
          theme === 'dark' ? 'text-blue-400/70' : 'text-blue-500/70'
        }`}
        viewBox="0 0 16 16"
      >
        <path
          d="M2 8h10M8 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default FlowArrow;
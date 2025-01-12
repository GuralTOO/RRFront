// Continue after DatabaseIllustration...
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const ScreeningIllustration = () => {
  const { theme } = useTheme();
  
  return (
    <div className="w-full h-full relative">
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className={`border-r border-b ${
              theme === 'dark' 
                ? 'border-neutral-800' 
                : 'border-gray-100'
            }`}
          />
        ))}
      </div>
      
      {/* Animated elements */}
      <div className="relative h-full flex items-center justify-center">
        <motion.div
          className={`w-3 h-3 rounded-full ${
            theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Connecting lines */}
        {[30, 150, 270].map((rotation, index) => (
          <motion.div
            key={index}
            className={`absolute w-32 h-0.5 ${
              theme === 'dark' ? 'bg-blue-400/30' : 'bg-blue-500/30'
            }`}
            style={{
              transformOrigin: 'left center',
              rotate: `${rotation}deg`
            }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.5
            }}
          />
        ))}
      </div>
    </div>
  );
};

const SecurityIllustration = () => {
  const { theme } = useTheme();
  
  return (
    <div className="w-full h-full relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.path
          d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z"
          stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="15"
          stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'}
          strokeWidth="2"
          fill="none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        />
      </svg>
    </div>
  );
};

const ExtractionIllustration = () => {
  const { theme } = useTheme();
  
  return (
    <div className="w-full h-full relative">
      <div className="grid grid-cols-4 grid-rows-4 gap-2 p-4 h-full">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            className={`rounded ${
              theme === 'dark' 
                ? 'bg-neutral-800' 
                : 'bg-gray-100'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: i * 0.05,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
          />
        ))}
      </div>

      {/* Highlight animation */}
      <motion.div
        className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-blue-400/10' 
            : 'bg-blue-500/5'
        }`}
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
    </div>
  );
};

const AnalyticsIllustration = () => {
  const { theme } = useTheme();
  
  return (
    <div className="w-full h-full relative p-4">
      {/* Bar chart */}
      <div className="flex items-end justify-between h-full gap-2">
        {[40, 70, 55, 85, 60].map((height, index) => (
          <motion.div
            key={index}
            className={`w-full rounded-t ${
              theme === 'dark' 
                ? 'bg-blue-400' 
                : 'bg-blue-500'
            }`}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
          />
        ))}
      </div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {[0, 1, 2, 3].map((_, i) => (
          <div
            key={i}
            className={`w-full h-px ${
              theme === 'dark' 
                ? 'bg-neutral-800' 
                : 'bg-gray-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const DatabaseIllustration = () => {
  const { theme } = useTheme();
  
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <motion.path
        d="M100 150 Q200 50 300 150 T500 150"
        stroke={theme === 'dark' ? '#60A5FA' : '#2563EB'}
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
};

// Export all illustrations
export {
  DatabaseIllustration,
  ScreeningIllustration,
  SecurityIllustration,
  ExtractionIllustration,
  AnalyticsIllustration
};
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';

const getClassName = (isActive, isHighlighted, theme) => {
    return (
        isHighlighted ? `absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs
          ${isHighlighted ? 'text-blue-500' : theme === 'dark' ? 'text-neutral-400' : 'text-gray-400'}`
          : `absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs
          ${isHighlighted ? 'text-blue-500' : theme === 'dark' ? 'text-neutral-400' : 'text-gray-400'}`
    );
}

const DocumentIcon = ({ isHighlighted, theme, score, index, isActive }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 20, rotate: (-2 + Math.random() * 4) }}
    animate={{ 
      opacity: 1, 
      y: 0,
      rotate: 0,
      scale: isHighlighted && isActive ? 1.05 : 1
    }}
    transition={{ 
      duration: 0.5, 
      delay: index * 0.1,
      scale: { duration: 0.3 }
    }}
  >
    {/* Score indicator */}
    {isActive && (
      <motion.div
        className={getClassName(isActive, isHighlighted, theme)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + index * 0.1 }}
      >
        {score.toFixed(1)}
      </motion.div>
    )}

    {/* Document icon with inner content */}
    <motion.div
      className={`w-12 h-14 rounded border-2 relative overflow-hidden
        ${isHighlighted && isActive
          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
          : theme === 'dark'
          ? 'border-neutral-700'
          : 'border-gray-200'}`}
      animate={{
        y: isHighlighted && isActive ? -2 : 0
      }}
    >
      {/* Scanning animation overlay */}
      {isActive && (
        <motion.div
          className="absolute w-full h-1 bg-blue-500/30"
          initial={{ top: 0, opacity: 0 }}
          animate={{ 
            top: ['0%', '100%'],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 1,
            delay: index * 0.1,
            times: [0, 0.1, 0.9, 1]
          }}
        />
      )}

      {/* Document content lines */}
      <div className="absolute top-0 left-0 w-full h-full p-1.5">
        <div className="space-y-1">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-0.5 rounded ${
                theme === 'dark' ? 'bg-neutral-600' : 'bg-gray-200'
              }`}
              style={{ 
                width: `${50 + Math.random() * 40}%`,
                opacity: 1 - (i * 0.2)
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const RelevanceScoring = ({ isActive }) => {
  const { theme } = useTheme();
  
  // Generate random scores in decreasing order using useMemo
  const papers = useMemo(() => {
    // Generate first score between 9.5 and 10
    let currentScore = 9.5 + Math.random() * 0.5;
    
    return Array(9).fill(null).map(() => {
      // Add some randomness to the decrease amount (between 0.3 and 1.2)
      const decrease = 0.3 + Math.random() * 0.9;
      const score = currentScore;
      currentScore -= decrease;
      return { score: Math.max(score, 0) }; // Ensure score doesn't go below 0
    });
  }, [isActive]); // Regenerate when isActive changes

  return (
    <motion.div
      className={`text-center ${
        theme === 'dark' ? 'text-neutral-200' : 'text-gray-600'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-3 gap-5 mb-4">
        {papers.map((paper, i) => (
          <DocumentIcon
            key={i}
            index={i}
            isHighlighted={i < 3}
            theme={theme}
            score={paper.score}
            isActive={isActive}
          />
        ))}
      </div>
      <motion.div>
        <p className="text-lg">Relevance scoring</p>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'
        }`}>
          92% accuracy
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RelevanceScoring;
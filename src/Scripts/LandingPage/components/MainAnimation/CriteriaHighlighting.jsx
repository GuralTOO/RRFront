import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';

const CriteriaHighlighting = ({ isActive }) => {
  const { theme } = useTheme();

  // Define which lines should be highlighted with their starting positions
  const highlightedLines = [
    { index: 1, start: '0%', end: '50%' },
    { index: 4, start: '10%', end: '75%' },
    { index: 6, start: '25%', end: '65%' },
  ];

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main container with subtle depth */}
      <div className={`w-48 h-56 rounded p-4 ${
        theme === 'dark'
          ? 'bg-neutral-800 shadow-md border border-neutral-700'
          : 'bg-white shadow-md border border-gray-100'
      }`}>
        <div className="space-y-3.5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="relative">
              {/* Base line - always visible */}
              <div
                className={`h-1 rounded ${
                  theme === 'dark'
                    ? 'bg-neutral-700'
                    : 'bg-gray-200'
                } w-full`}
              />
              {/* Highlight overlay - only appears when active */}
              {highlightedLines.find(line => line.index === i) && (
                <motion.div
                  className="absolute top-0 h-1 bg-blue-500 rounded w-3/4"
                  style={{
                    left: highlightedLines.find(line => line.index === i).start
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? highlightedLines.find(line => line.index === i).end : 0 }}
                  transition={{
                    duration: 0.7,
                    delay: isActive ? 0.5 + (highlightedLines.findIndex(line => line.index === i) * 0.3) : 0,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <p className={`text-lg mt-4 ${
        theme === 'dark' ? 'text-neutral-200' : 'text-gray-600'
      }`}>
        Automatic criteria
      </p>
      <p className={`text-sm ${
        theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'
      }`}>
        highlighting
      </p>
    </motion.div>
  );
};

export default CriteriaHighlighting;
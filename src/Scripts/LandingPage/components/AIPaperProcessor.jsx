import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

const AIScoreIndicator = ({ score }) => {
  const { theme } = useTheme();
  
  const getScoreColor = (score) => {
    if (score >= 8) return theme === 'dark' ? 'text-green-400' : 'text-green-500';
    if (score >= 5) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500';
    return theme === 'dark' ? 'text-red-400' : 'text-red-500';
  };

  return (
    <motion.div
      className={`absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-sm font-medium ${getScoreColor(score)}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {score.toFixed(1)}
    </motion.div>
  );
};

const EnhancedPaper = ({ index, score, status, scale = 1, showScore = false }) => {
  const { theme } = useTheme();
  
  const getStatusColor = () => {
    switch (status) {
      case 'scanning':
        return theme === 'dark' ? 'stroke-blue-400' : 'stroke-blue-500';
      case 'accepted':
        return theme === 'dark' ? 'stroke-green-400' : 'stroke-green-500';
      case 'rejected':
        return theme === 'dark' ? 'stroke-red-400' : 'stroke-red-500';
      default:
        return theme === 'dark' ? 'stroke-neutral-700' : 'stroke-gray-200';
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <svg width={60 * scale} height={80 * scale} viewBox={`0 0 ${60 * scale} ${80 * scale}`}>
        {/* Paper background */}
        <motion.rect
          width={60 * scale}
          height={80 * scale}
          rx={4}
          className={`${theme === 'dark' ? 'fill-neutral-800' : 'fill-white'} ${getStatusColor()}`}
          strokeWidth="1.5"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        
        {/* Content lines */}
        {[...Array(5)].map((_, i) => (
          <motion.rect
            key={i}
            x={10 * scale}
            y={(20 + i * 12) * scale}
            width={((30 + Math.random() * 15) * scale)}
            height={2 * scale}
            className={theme === 'dark' ? 'fill-neutral-700' : 'fill-gray-200'}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          />
        ))}

        {/* Scanning effect */}
        {status === 'scanning' && (
          <motion.rect
            width={60 * scale}
            height={2 * scale}
            rx={1}
            className={theme === 'dark' ? 'fill-blue-400/20' : 'fill-blue-500/20'}
            animate={{
              y: [0, 80 * scale, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </svg>

      {/* Score indicator */}
      {showScore && <AIScoreIndicator score={score} />}
    </motion.div>
  );
};

const PaperStack = ({ papers, type = 'default', onProcessComplete }) => {
  const [processedPapers, setProcessedPapers] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  React.useEffect(() => {
    if (currentIndex >= papers.length) {
      onProcessComplete?.(processedPapers);
      return;
    }

    const timer = setTimeout(() => {
      const paper = papers[currentIndex];
      setProcessedPapers(prev => [...prev, {
        ...paper,
        status: paper.score >= 5 ? 'accepted' : 'rejected'
      }]);
      setCurrentIndex(prev => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentIndex, papers, onProcessComplete]);

  return (
    <div className="relative">
      {processedPapers.map((paper, i) => (
        <div 
          key={i}
          className="absolute"
          style={{
            transform: `translate(${i * 2}px, ${-i * 3}px)`
          }}
        >
          <EnhancedPaper
            index={i}
            {...paper}
            showScore={i === processedPapers.length - 1}
          />
        </div>
      ))}
    </div>
  );
};

export { PaperStack, EnhancedPaper };
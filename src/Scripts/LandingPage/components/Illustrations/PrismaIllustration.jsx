import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';

const PrismaIllustration = () => {
  const { theme } = useTheme();
  
  const colors = {
    border: theme === 'dark' ? '#60A5FA' : '#3B82F6',
    excluded: theme === 'dark' ? '#404040' : '#E5E7EB',
  };

  // Progressive size reduction for each row
  const boxSizes = {
    top: { w: 120, h: 90 },
    middle: { w: 100, h: 80 },
    bottom: { w: 80, h: 70 }
  };

  // Calculate center positions
  const centerX = 200;
  const leftBoxX = centerX - 100;
  const rightBoxX = centerX + 100;

  const boxAnimation = {
    initial: { opacity: 0.7 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="w-full h-full relative">
      <svg width="100%" height="100%" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet">
        {/* Left side boxes (blue) */}
        <motion.rect 
          x={leftBoxX - boxSizes.top.w/2} 
          y="50" 
          width={boxSizes.top.w} 
          height={boxSizes.top.h} 
          rx="4"
          fill="none"
          stroke={colors.border}
          strokeWidth="2"
          variants={boxAnimation}
          initial="initial"
          animate="animate"
        />
        
        <motion.rect 
          x={leftBoxX - boxSizes.middle.w/2} 
          y="200" 
          width={boxSizes.middle.w} 
          height={boxSizes.middle.h} 
          rx="4"
          fill="none"
          stroke={colors.border}
          strokeWidth="2"
          variants={boxAnimation}
          initial="initial"
          animate="animate"
        />

        <motion.rect 
          x={leftBoxX - boxSizes.bottom.w/2} 
          y="350" 
          width={boxSizes.bottom.w} 
          height={boxSizes.bottom.h} 
          rx="4"
          fill="none"
          stroke={colors.border}
          strokeWidth="2"
          variants={boxAnimation}
          initial="initial"
          animate="animate"
        />

        {/* Right side boxes (grey) */}
        <motion.rect 
          x={rightBoxX - boxSizes.top.w/2} 
          y="50" 
          width={boxSizes.top.w} 
          height={boxSizes.top.h} 
          rx="4"
          fill="none"
          stroke={colors.excluded}
          strokeWidth="2"
          variants={boxAnimation}
          initial="initial"
          animate="animate"
        />
        
        <motion.rect 
          x={rightBoxX - boxSizes.middle.w/2} 
          y="200" 
          width={boxSizes.middle.w} 
          height={boxSizes.middle.h} 
          rx="4"
          fill="none"
          stroke={colors.excluded}
          strokeWidth="2"
          variants={boxAnimation}
          initial="initial"
          animate="animate"
        />

        {/* Horizontal connecting lines */}
        {/* Top blue box to top grey box */}
        <motion.path
          d={`M${leftBoxX + boxSizes.top.w/2} ${95} L${rightBoxX - boxSizes.top.w/2} ${95}`}
          stroke={colors.excluded}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
          style={{ pathLength: 0, pathOffset: 0 }}
        />
        
        {/* Middle blue box to middle grey box */}
        <motion.path
          d={`M${leftBoxX + boxSizes.middle.w/2} ${240} L${rightBoxX - boxSizes.middle.w/2} ${240}`}
          stroke={colors.excluded}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
          style={{ pathLength: 0, pathOffset: 0 }}
        />

        {/* Vertical connections between blue boxes */}
        <motion.path
          d={`M${leftBoxX} ${140} L${leftBoxX} ${200}`}
          stroke={colors.border}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
          style={{ pathLength: 0, pathOffset: 0 }}
        />

        <motion.path
          d={`M${leftBoxX} ${280} L${leftBoxX} ${350}`}
          stroke={colors.border}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
          style={{ pathLength: 0, pathOffset: 0 }}
        />
      </svg>
    </div>
  );
};

export default PrismaIllustration;
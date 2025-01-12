import React from 'react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import RelevanceScoring from './MainAnimation/RelevanceScoring';
import CriteriaHighlighting from './MainAnimation/CriteriaHighlighting';
import DataExtraction from './MainAnimation/DataExtraction';
import FlowArrow from './MainAnimation/FlowArrow';

const SystematicReviewFlow = () => {
  const { theme } = useTheme();
  const [activeStage, setActiveStage] = React.useState(1);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const containerRef = React.useRef(null);

  // Handle screen resize
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Add resize listener
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Stage transition timing
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Calculate spacing based on container width
  const getSpacing = () => {
    if (containerWidth < 640) return 'space-x-4'; // Small screens
    if (containerWidth < 1024) return 'space-x-8'; // Medium screens
    return 'space-x-16'; // Large screens
  };

  // Scale factor for very small screens
  const getScaleFactor = () => {
    if (containerWidth < 480) return 0.8;
    if (containerWidth < 640) return 0.9;
    return 1;
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-6xl mx-auto transition-colors duration-300 
        ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}
        ${containerWidth < 640 ? 'p-4' : 'p-8'}
      `}
    >
      <motion.div 
        className={`flex items-center justify-center ${getSpacing()} flex-nowrap`}
        style={{
          transform: `scale(${getScaleFactor()})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Stage 1 */}
        <motion.div
          animate={{
            opacity: activeStage >= 1 ? 1 : 0.5,
            scale: activeStage >= 1 ? 1 : 0.95
          }}
          transition={{ duration: 0.3 }}
        >
          <RelevanceScoring isActive={activeStage >= 1} />
        </motion.div>

        {/* Arrow 1 */}
        <motion.div
          animate={{
            opacity: activeStage >= 1 ? 1 : 0.3
          }}
          transition={{ duration: 0.3 }}
        >
          <FlowArrow isActive={activeStage >= 1} />
        </motion.div>

        {/* Stage 2 */}
        <motion.div
          animate={{
            opacity: activeStage >= 2 ? 1 : 0.5,
            scale: activeStage >= 2 ? 1 : 0.95
          }}
          transition={{ duration: 0.3 }}
        >
          <CriteriaHighlighting isActive={activeStage >= 2} />
        </motion.div>

        {/* Arrow 2 */}
        <motion.div
          animate={{
            opacity: activeStage >= 2 ? 1 : 0.3
          }}
          transition={{ duration: 0.3 }}
        >
          <FlowArrow isActive={activeStage >= 2} />
        </motion.div>

        {/* Stage 3 */}
        <motion.div
          animate={{
            opacity: activeStage >= 3 ? 1 : 0.5,
            scale: activeStage >= 3 ? 1 : 0.95
          }}
          transition={{ duration: 0.3 }}
        >
          <DataExtraction isActive={activeStage >= 3} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SystematicReviewFlow;


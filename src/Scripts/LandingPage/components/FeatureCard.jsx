import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { Check } from 'lucide-react';

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  bulletPoints = [],
  illustration: Illustration,
  size = "normal"
}) => {
  const { theme } = useTheme();

  const cardBaseClasses = `
    rounded-xl border transition-all duration-300 overflow-hidden backdrop-blur-sm h-full
    ${theme === 'dark'
      ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
      : 'bg-white/70 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
    }
  `;

  // Helper function for header content
  const renderHeader = () => (
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>
            <Icon size={24} strokeWidth={2} />
          </div>
        )}
        <h3 className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>{title}</h3>
      </div>
      {description && (
        <p className={`${
          theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
        } text-sm leading-relaxed`}>{description}</p>
      )}
    </div>
  );

  // Helper function for bullet points
  const renderBulletPoints = () => (
    <ul className="space-y-4">
      {bulletPoints.map((point, index) => (
        <li key={index} className="flex items-start">
          <Check className={`w-4 h-4 mr-3 mt-1 flex-shrink-0 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <span className={`${
            theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
          } leading-relaxed text-sm`}>{point}</span>
        </li>
      ))}
    </ul>
  );

  // Medium card with side-by-side layout
  if (size === "medium") {
    return (
      <motion.div
        className={cardBaseClasses}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="grid md:grid-cols-2 h-full">
          <div className="p-6 lg:p-8">
            {renderHeader()}
            {bulletPoints.length > 0 && renderBulletPoints()}
          </div>
          {Illustration && (
            <div className="relative h-full min-h-[240px] md:min-h-0">
              <div className={`absolute inset-0 ${
                theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-50/80'
              }`}>
                <Illustration />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Normal card with bottom illustration
  return (
    <motion.div
      className={cardBaseClasses}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 lg:p-6">
          {renderHeader()}
          {bulletPoints.length > 0 && renderBulletPoints()}
        </div>
        {Illustration && (
          <div className="mt-auto relative flex-grow min-h-[220px]">
            <div className={`absolute inset-0 ${
              theme === 'dark' ? 'bg-neutral-800/50' : 'bg-gray-50/80'
            }`}>
              <Illustration />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard;
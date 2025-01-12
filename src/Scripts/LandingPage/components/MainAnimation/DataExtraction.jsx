import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { ChevronRight } from 'lucide-react';

const DataExtraction = ({ isActive }) => {
  const { theme } = useTheme();

  // Visible columns
  const columns = [
    'Population',
    'Outcome',
  ];

  // Define rows (papers) and their data
  const rows = [
    { id: 1, data: ['65+ years', '80% effective'] },
    { id: 2, data: ['Adults 18-65', '75% effective'] },
    { id: 3, data: ['Children', '85% effective'] }
  ];

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`w-56 h-56 rounded ${
        theme === 'dark'
          ? 'bg-neutral-800 border-neutral-700'
          : 'bg-white border-gray-200'
      } border overflow-hidden relative`}>
        {/* Gradient overlay on the right to suggest more content */}
        <div className="absolute top-0 right-0 w-8 h-full pointer-events-none z-10"
          style={{
            background: theme === 'dark' 
              ? 'linear-gradient(90deg, transparent, rgb(23, 23, 23) 90%)'
              : 'linear-gradient(90deg, transparent, white 90%)'
          }}
        >
          <div className="h-full flex items-center justify-end pr-1">
            <ChevronRight className={`w-4 h-4 ${
              theme === 'dark' ? 'text-neutral-600' : 'text-gray-400'
            }`} />
          </div>
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-2 border-b px-2 py-2">
          {columns.map((col, i) => (
            <div 
              key={i} 
              className={`text-xs font-medium ${
                theme === 'dark' ? 'text-neutral-400' : 'text-gray-600'
              } ${i === 0 ? 'border-r' : ''} ${
                theme === 'dark' ? 'border-neutral-700' : 'border-gray-200'
              }`}
            >
              {col}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        <div className="px-2">
          {rows.map((row, rowIndex) => (
            <div 
              key={row.id}
              className={`grid grid-cols-2 border-b last:border-b-0 ${
                theme === 'dark' ? 'border-neutral-700' : 'border-gray-200'
              }`}
            >
              {row.data.map((cell, colIndex) => (
                <div 
                  key={`${row.id}-${colIndex}`} 
                  className={`py-3 relative ${
                    colIndex === 0 ? 'border-r' : ''
                  } ${
                    theme === 'dark' ? 'border-neutral-700' : 'border-gray-200'
                  }`}
                >
                  <motion.div
                    className={`h-1 rounded mx-auto ${
                      theme === 'dark' ? 'bg-neutral-700' : 'bg-gray-200'
                    }`}
                    style={{ width: '80%' }}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + (rowIndex * 0.2) + (colIndex * 0.3)
                      }}
                    >
                      <div 
                        className={`h-1 rounded bg-blue-500`}
                        style={{ width: '80%' }}
                      />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Column numbers hint */}
        <div className={`absolute bottom-0 right-8 text-xs ${
          theme === 'dark' ? 'text-neutral-600' : 'text-gray-400'
        }`}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            2/20
          </motion.span>
        </div>
      </div>
      <p className={`text-lg mt-4 ${
        theme === 'dark' ? 'text-neutral-200' : 'text-gray-600'
      }`}>
        Assisted Data
      </p>
      <p className={`text-sm ${
        theme === 'dark' ? 'text-neutral-400' : 'text-gray-500'
      }`}>
        extraction
      </p>
    </motion.div>
  );
};

export default DataExtraction;
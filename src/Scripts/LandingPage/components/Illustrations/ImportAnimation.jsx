import React from 'react';
import { FileText, Database } from 'lucide-react';

const ImportAnimation = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-72 h-48 flex items-stretch justify-between">
        {/* Source files spread in a pleasing arrangement */}
        <div className="relative h-48 w-20 flex items-center">
          {[
            { top: '0%', left: '0px', delay: 0 },
            { top: '30%', left: '12px', delay: 0.2 },
            { top: '60%', left: '0px', delay: 0.4 }
          ].map((position, index) => (
            <div
              key={index}
              className="absolute w-12 h-14 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm transition-all duration-500 ease-in-out"
              style={{
                top: position.top,
                left: position.left,
                animation: `floatRight 3s ease-in-out infinite`,
                animationDelay: `${position.delay}s`,
                opacity: 0.9
              }}
            >
              <FileText
                className="w-5 h-5 text-blue-500/90 dark:text-blue-400"
                strokeWidth={1.5}
              />
            </div>
          ))}
        </div>

        {/* Connecting lines with adjusted spacing */}
        <div className="flex-1 h-48 flex items-center relative mx-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="absolute h-[2px] bg-blue-500/20 dark:bg-blue-400/20"
              style={{
                top: `${index * 30 + 20}%`,
                left: '0px',
                right: '20px',
                animation: `lineFlow 3s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div 
                className="h-full bg-blue-500/90 dark:bg-blue-400"
                style={{
                  width: '30%',
                  animation: `linePulse 3s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`
                }}
              />
            </div>
          ))}
        </div>

        {/* Database icon with more space from lines */}
        <div className="flex items-center justify-end w-20 pr-4">
          <Database
            className="w-12 h-12 text-blue-500/90 dark:text-blue-400"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes floatRight {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }

        @keyframes lineFlow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes linePulse {
          0% {
            transform: translateX(0%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(240%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ImportAnimation;
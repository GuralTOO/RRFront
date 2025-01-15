import React, { useEffect, useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';

const AIScreeningAnimation = () => {
  const [activeDocument, setActiveDocument] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDocument((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full h-48">
        {/* AI Analysis visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-72 h-72">
            {/* Circular path for documents */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 dark:border-blue-400/20" />
            
            {/* Documents on circular path */}
            {[0, 1, 2].map((index) => {
              const angle = (index * 120 + 180) * (Math.PI / 180);
              const x = Math.cos(angle) * 80;
              const y = Math.sin(angle) * 80;
              const isActive = activeDocument === index;

              return (
                <div
                  key={index}
                  className={`absolute w-14 h-16 transition-all duration-500 ease-in-out`}
                  style={{
                    transform: `translate(${x + 144}px, ${y + 144}px) scale(${isActive ? 1.1 : 0.9})`,
                  }}
                >
                  {/* Document card */}
                  <div className={`relative w-full h-full rounded-lg border ${
                    isActive 
                      ? 'border-blue-500 dark:border-blue-400 shadow-lg' 
                      : 'border-gray-200 dark:border-neutral-700'
                  } bg-white dark:bg-neutral-800 flex items-center justify-center`}>
                    <FileText 
                      className={`w-6 h-6 ${
                        isActive 
                          ? 'text-blue-500 dark:text-blue-400' 
                          : 'text-gray-400 dark:text-neutral-600'
                      }`}
                      strokeWidth={1.5}
                    />
                    
                    {/* Relevance score */}
                    <div className={`absolute -right-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${isActive 
                        ? 'bg-blue-500 dark:bg-blue-400 text-white' 
                        : 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400'
                      }`}>
                      {3 - index}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Central AI processing visualization */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20">
              <div className="relative w-full h-full">
                {/* Animated rings */}
                {[0, 1, 2].map((ring) => (
                  <div
                    key={ring}
                    className="absolute inset-0 rounded-full border border-blue-500/30 dark:border-blue-400/30"
                    style={{
                      animation: `ringPulse 3s ease-in-out infinite`,
                      animationDelay: `${ring * 0.5}s`,
                    }}
                  />
                ))}
                <Sparkles 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 dark:text-blue-400"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ringPulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AIScreeningAnimation;
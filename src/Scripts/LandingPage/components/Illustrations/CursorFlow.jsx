import React, { useRef, useState } from 'react';

const CursorFlow = () => {
  const cardRef = useRef(null);
  const [svgTransform1, setSvgTransform1] = useState('translate(0px, 0px)');
  const [svgTransform2, setSvgTransform2] = useState('translate(0px, 0px)');
  const [selfTransform, setSelfTransform] = useState('translate(0px, 0px)');

  const handleMouseMove = (event) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      // Calculate positions relative to card center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offsetX = (mouseX - centerX) / centerX * 100;
      const offsetY = (mouseY - centerY) / centerY * 100;

      // Different movement speeds for each element
      setSvgTransform1(`translate(${-offsetX * 1.5}px, ${-offsetY * 1.5}px)`);
      setSvgTransform2(`translate(${offsetX}px, ${offsetY}px)`);
      setSelfTransform(`translate(${mouseX}px, ${mouseY}px)`);
    }
  };

  const handleMouseLeave = () => {
    setSvgTransform1('translate(0px, 0px)');
    setSvgTransform2('translate(0px, 0px)');
    setSelfTransform('translate(0px, 0px)');
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full h-full overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* User cursor 1 */}
      <div
        className="absolute top-1/4 left-1/4 will-change-transform"
        style={{
          transform: svgTransform1,
          transition: 'transform 0.75s ease-out',
        }}
      >
        <div className="relative">
          <svg
            width="30"
            height="38"
            viewBox="0 0 30 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.58385 1.69742C2.57836 0.865603 1.05859 1.58076 1.05859 2.88572V35.6296C1.05859 37.1049 2.93111 37.7381 3.8265 36.5656L12.5863 25.0943C12.6889 24.96 12.8483 24.8812 13.0173 24.8812H27.3245C28.7697 24.8812 29.4211 23.0719 28.3076 22.1507L3.58385 1.69742Z"
              className="fill-gray-100 dark:fill-neutral-800 stroke-blue-500 dark:stroke-blue-400"
              strokeWidth="1.5"
            />
          </svg>
          <div className="absolute -top-8 left-full flex items-center space-x-1 border rounded-full px-3 py-1.5 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse delay-150" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse delay-300" />
          </div>
        </div>
      </div>

      {/* User cursor 2 */}
      <div
        className="absolute bottom-1/4 right-1/4 will-change-transform scale-75"
        style={{
          transform: svgTransform2,
          transition: 'transform 1s ease-out',
        }}
      >
        <div className="relative">
          <svg
            width="30"
            height="38"
            viewBox="0 0 30 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.58385 1.69742C2.57836 0.865603 1.05859 1.58076 1.05859 2.88572V35.6296C1.05859 37.1049 2.93111 37.7381 3.8265 36.5656L12.5863 25.0943C12.6889 24.96 12.8483 24.8812 13.0173 24.8812H27.3245C28.7697 24.8812 29.4211 23.0719 28.3076 22.1507L3.58385 1.69742Z"
              className="fill-gray-100 dark:fill-neutral-800 stroke-blue-500 dark:stroke-blue-400"
              strokeWidth="1.5"
            />
          </svg>
          <div className="absolute -top-8 left-full flex items-center space-x-1 border rounded-full px-3 py-1.5 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse delay-150" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse delay-300" />
          </div>
        </div>
      </div>

      {/* Self cursor */}
      <div
        className="absolute top-0 left-0 will-change-transform opacity-0 group-hover:opacity-100 transition-opacity delay-75 duration-300"
        style={{
          transform: selfTransform,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className="absolute -top-8 left-2 flex items-center space-x-1 border rounded-full px-3 py-1.5 bg-blue-500 dark:bg-blue-400 border-blue-500 dark:border-blue-400">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-150" />
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-300" />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-gray-50 dark:to-neutral-800/50 pointer-events-none" />
    </div>
  );
};

export default CursorFlow;
import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

const DocumentExportDark = () => (
  <g transform="scale(0.7) translate(80, -60)">
    {/* Background grid */}
    <path d="M279.173 650.277L279.173 275.195" stroke="#2E2E2E" strokeWidth="0.502235"/>
    <path d="M117.441 650.277L117.441 275.195" stroke="#2E2E2E" strokeWidth="0.502235"/>
    <path d="M198.313 696.482L198.313 321.401" stroke="#2E2E2E" strokeWidth="0.502235"/>
    

    
    {/* Main document structure */}
    <path 
      d="M160 140L280 140L280 280L160 280L160 140Z" 
      fill="white" 
      fillOpacity="0.03"
      stroke="#7E7E7E"
      strokeWidth="1.00447"
    />
    
    {/* Document lines */}
    <path d="M175 165L265 165" stroke="#7E7E7E" strokeWidth="1" strokeDasharray="1 2"/>
    <path d="M175 185L245 185" stroke="#7E7E7E" strokeWidth="1" strokeDasharray="1 2"/>
    <path d="M175 205L255 205" stroke="#7E7E7E" strokeWidth="1" strokeDasharray="1 2"/>
    <path d="M175 225L235 225" stroke="#7E7E7E" strokeWidth="1" strokeDasharray="1 2"/>
    
    {/* Document header bar */}
    <rect x="160" y="140" width="120" height="15" fill="#3B82F6" fillOpacity="0.1"/>
    
    {/* Tracking points */}
    <circle cx="190" cy="165" r="2" fill="#3B82F6"/>
    <circle cx="190" cy="185" r="2" fill="#3B82F6"/>
    <circle cx="190" cy="205" r="2" fill="#3B82F6"/>
    <circle cx="190" cy="225" r="2" fill="#3B82F6"/>
    
  </g>
);

const DocumentExportLight = () => (
  <g transform="scale(0.7) translate(80, -60)">
    {/* Background grid */}
    <path d="M279.173 650.277L279.173 275.195" stroke="#EDEDED" strokeWidth="0.502235"/>
    <path d="M117.441 650.277L117.441 275.195" stroke="#EDEDED" strokeWidth="0.502235"/>
    <path d="M198.313 696.482L198.313 321.401" stroke="#EDEDED" strokeWidth="0.502235"/>
    

    
    {/* Main document structure */}
    <path 
      d="M160 140L280 140L280 280L160 280L160 140Z" 
      fill="white" 
      fillOpacity="0.03"
      stroke="#707070"
      strokeWidth="1.00447"
    />
    
    {/* Document lines */}
    <path d="M175 165L265 165" stroke="#707070" strokeWidth="1" strokeDasharray="1 2"/>
    <path d="M175 185L245 185" stroke="#707070" strokeWidth="1" strokeDasharray="1 2"/>
    <path d="M175 205L255 205" stroke="#707070" strokeWidth="1" strokeDasharray="1 2"/>
    <path d="M175 225L235 225" stroke="#707070" strokeWidth="1" strokeDasharray="1 2"/>
    
    {/* Document header bar */}
    <rect x="160" y="140" width="120" height="15" fill="#3B82F6" fillOpacity="0.1"/>
    
    {/* Tracking points */}
    <circle cx="190" cy="165" r="2" fill="#3B82F6"/>
    <circle cx="190" cy="185" r="2" fill="#3B82F6"/>
    <circle cx="190" cy="205" r="2" fill="#3B82F6"/>
    <circle cx="190" cy="225" r="2" fill="#3B82F6"/>
  </g>
);

const DocumentExportAnimation = () => {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const [gradientPos, setGradientPos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  const handleGlow = (event) => {
    if (!ref.current || !containerRef.current) return null;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const xCont = event.clientX - containerRect.x;
    const yCont = event.clientY - containerRect.y;
    
    const isContainerHovered =
      xCont > -3 && 
      xCont < containerRect.width + 3 && 
      yCont > -3 && 
      yCont < containerRect.height + 3;
      
    if (!isContainerHovered) return;
    
    const svgRect = ref.current.getBoundingClientRect();
    const x = event.clientX - svgRect.x;
    const y = event.clientY - svgRect.y;
    setGradientPos({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleGlow);
    return () => {
      window.removeEventListener('mousemove', handleGlow);
    };
  }, []);

  const gradientTransform = `translate(${gradientPos?.x} ${gradientPos.y}) rotate(56.4303) scale(132.019)`;

  return (
    <div 
      className="relative w-full aspect-[390/430] group bg-white dark:bg-black"
      ref={containerRef}
      role="img"
      aria-label="Documentation export visualization"
    >
      {/* Base SVG */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 390 430"
        fill="none"
      >
        {theme === 'dark' ? <DocumentExportDark /> : <DocumentExportLight />}
      </svg>

      {/* Glowing outline effect */}
      <svg
        ref={ref}
        viewBox="0 0 390 430"
        fill="none"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      >
        <g transform="scale(0.7) translate(80, -20)">
          {/* Document outline glow */}
          <path 
            d="M160 140L280 140L280 280L160 280L160 140Z"
            stroke="url(#glowGradient)"
            strokeWidth={1.5}
            fill="none"
          />
          
          {/* Export lines glow */}
          <path 
            d="M280 180L330 160"
            stroke="url(#glowGradient)"
            strokeWidth={1.5}
            strokeDasharray="1 3"
          />
          <path 
            d="M280 220L330 240"
            stroke="url(#glowGradient)"
            strokeWidth={1.5}
            strokeDasharray="1 3"
          />
        </g>
        <defs>
          <radialGradient
            id="glowGradient"
            cx="0"
            cy="0"
            r="2"
            gradientUnits="userSpaceOnUse"
            gradientTransform={gradientTransform}
          >
            <stop stopColor="rgb(59, 130, 246)" />
            <stop offset="1" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>


      <div 
        className="absolute right-12 bottom-32 px-3 py-1.5 rounded-full bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-500/5 dark:to-blue-500/10 ring-1 ring-blue-500/20"
        style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Decision history</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentExportAnimation;
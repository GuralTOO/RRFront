import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../../ThemeContext';
import { TrendingUp, Users, Clock } from 'lucide-react';

const AnalyticsCubeDark = () => (
  <g transform="scale(0.7) translate(80, -20)">
    {/* Background elements */}
    <path d="M279.173 650.277L279.173 275.195" stroke="#2E2E2E" strokeWidth="0.502235"/>
    <path d="M117.441 650.277L117.441 275.195" stroke="#2E2E2E" strokeWidth="0.502235"/>
    <path d="M198.313 696.482L198.313 321.401" stroke="#2E2E2E" strokeWidth="0.502235"/>
    
    {/* Background grid lines */}
    <path d="M279.173 650.277L279.173 275.195" stroke="#2E2E2E" strokeWidth="0.502235"/>
    <path d="M117.441 650.277L117.441 275.195" stroke="#2E2E2E" strokeWidth="0.502235"/>
    <path d="M198.313 696.482L198.313 321.401" stroke="#2E2E2E" strokeWidth="0.502235"/>
    
    {/* Room corner background */}
    <path 
      d="M-227.715 468.123L196.012 219.457L619.285 470.366L-227.715 468.123Z" 
      fill="#232323" 
      fillOpacity="0.8" 
      stroke="#2E2E2E" 
      strokeWidth="1.23671"
    />
    
    {/* Main cube structure */}
    <path d="M195.998 125.21L276.455 171.663V267.035L195.988 313.197L115.117 266.395V171.411L195.998 125.21Z" fill="white" fillOpacity="0.03"/>
    <path d="M276.455 171.663L195.998 125.21L115.117 171.411M276.455 171.663V267.035L195.988 313.197M276.455 171.663L212.84 208.223L195.676 218.177M195.988 313.197L115.117 266.395V171.411M195.988 313.197L195.676 218.177M115.117 171.411L195.676 218.177" stroke="#7E7E7E" strokeWidth="1.00447"/>
    
    {/* Internal cube dots - more evenly spread */}
    <ellipse cx="205.482" cy="166.712" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
    <ellipse cx="235.676" cy="188.177" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
    <ellipse cx="175.95" cy="243.009" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
    <ellipse cx="245.8" cy="228.631" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
    <ellipse cx="155.676" cy="188.177" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
    <ellipse cx="195.676" cy="278.177" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
    
    {/* Dotted connections to floating insights - extended and more visible */}
    <path d="M205.482 166.712L300 110" stroke="#7E7E7E" strokeWidth="1.5" strokeDasharray="1 3"/>
    <path d="M155.676 188.177L80 170" stroke="#7E7E7E" strokeWidth="1.5" strokeDasharray="1 3"/>
  </g>
);

const AnalyticsCubeLight = () => (
    <g transform="scale(0.7) translate(80, -20)">
      {/* Background elements */}
      <path d="M279.173 650.277L279.173 275.195" stroke="#EDEDED" strokeWidth="0.502235"/>
      <path d="M117.441 650.277L117.441 275.195" stroke="#EDEDED" strokeWidth="0.502235"/>
      <path d="M198.313 696.482L198.313 321.401" stroke="#EDEDED" strokeWidth="0.502235"/>
      {/* Background grid lines */}
      <path d="M279.173 650.277L279.173 275.195" stroke="#EDEDED" strokeWidth="0.502235"/>
      <path d="M117.441 650.277L117.441 275.195" stroke="#EDEDED" strokeWidth="0.502235"/>
      <path d="M198.313 696.482L198.313 321.401" stroke="#EDEDED" strokeWidth="0.502235"/>
      {/* Room corner background */}
      <path
        d="M-227.715 468.123L196.012 219.457L619.285 470.366L-227.715 468.123Z"
        fill="#FCFCFC"
        fillOpacity="0.8"
        stroke="#EDEDED"
        strokeWidth="1.23671"
      />
      {/* Main cube structure */}
      <path d="M195.998 125.21L276.455 171.663V267.035L195.988 313.197L115.117 266.395V171.411L195.998 125.21Z" fill="white" fillOpacity="0.03"/>
      <path d="M276.455 171.663L195.998 125.21L115.117 171.411M276.455 171.663V267.035L195.988 313.197M276.455 171.663L212.84 208.223L195.676 218.177M195.988 313.197L115.117 266.395V171.411M195.988 313.197L195.676 218.177M115.117 171.411L195.676 218.177" stroke="#707070" strokeWidth="1.00447"/>
      {/* Internal cube dots - more evenly spread */}
      <ellipse cx="205.482" cy="166.712" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
      <ellipse cx="235.676" cy="188.177" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
      <ellipse cx="175.95" cy="243.009" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
      <ellipse cx="245.8" cy="228.631" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
      <ellipse cx="155.676" cy="188.177" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
      <ellipse cx="195.676" cy="278.177" rx="2.51118" ry="2.51117" fill="#3B82F6"/>
      {/* Dotted connections to floating insights - extended and more visible */}
      <path d="M205.482 166.712L300 110" stroke="#707070" strokeWidth="1.5" strokeDasharray="1 3"/>
      <path d="M155.676 188.177L80 170" stroke="#707070" strokeWidth="1.5" strokeDasharray="1 3"/>
    </g>
  );

  const AnalyticsAnimation = () => {
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
        aria-label="Data insights visualization"
      >
        {/* Base SVG */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 390 430"
          fill="none"
        >
          {theme === 'dark' ? <AnalyticsCubeDark /> : <AnalyticsCubeLight />}
        </svg>
  
        {/* Glowing outline effect */}
        <svg
          ref={ref}
          viewBox="0 0 390 430"
          fill="none"
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        >
          <g transform="scale(0.7) translate(80, -20)">
            {/* Complete cube structure highlight */}
            <path
              d="M195.998 125.21L276.455 171.663V267.035L195.988 313.197L115.117 266.395V171.411L195.998 125.21Z"
              stroke="url(#glowGradient)"
              strokeWidth={1.5}
            />
            {/* Internal lines highlight */}
            <path
              d="M276.455 171.663L195.998 125.21L115.117 171.411"
              stroke="url(#glowGradient)"
              strokeWidth={1.5}
            />
            <path
              d="M276.455 171.663L212.84 208.223L195.676 218.177"
              stroke="url(#glowGradient)"
              strokeWidth={1.5}
            />
            <path
              d="M195.988 313.197L195.676 218.177"
              stroke="url(#glowGradient)"
              strokeWidth={1.5}
            />
            <path
              d="M115.117 171.411L195.676 218.177"
              stroke="url(#glowGradient)"
              strokeWidth={1.5}
            />
            {/* Connecting lines highlight */}
            <path
              d="M205.482 166.712L300 110"
              stroke="url(#glowGradient)"
              strokeWidth={1.5}
              strokeDasharray="1 3"
            />
            <path
              d="M155.676 188.177L80 170"
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
  
        {/* Floating insights */}
        <div 
          className="absolute right-12 top-16 px-3 py-1.5 rounded-full bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-500/5 dark:to-blue-500/10 ring-1 ring-blue-500/20"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">92% done</span>
          </div>
        </div>
  
        <div 
          className="absolute left-12 top-24 px-3 py-1.5 rounded-full bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-500/5 dark:to-blue-500/10 ring-1 ring-blue-500/20"
          style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }}
        >
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">12 active</span>
          </div>
        </div>
  
        <div 
          className="absolute right-16 bottom-48 px-3 py-1.5 rounded-full bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-500/5 dark:to-blue-500/10 ring-1 ring-blue-500/20"
          style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">2.5 days left</span>
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

export default AnalyticsAnimation;
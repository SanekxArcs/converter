import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "PNG, AVIF & JPEG to WebP",
  subtitle = "Convert your images to WebP format instantly - reduce file sizes by up to 90%"
}) => {
  const { theme } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasAutoMinimized, setHasAutoMinimized] = useState(false);

  useEffect(() => {
    // Show full header for 3 seconds, then start minimizing
    const timer = setTimeout(() => {
      setIsMinimized(true);
      setHasAutoMinimized(true);
      // Hide loader elements after animation starts
      setTimeout(() => setShowLoader(false), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    if (hasAutoMinimized) {
      setIsMinimized(!isMinimized);
      setShowLoader(!isMinimized); // Show content when expanding
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasAutoMinimized && isMinimized) {
      setIsMinimized(false);
      setShowLoader(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hasAutoMinimized && !isMinimized) {
      setTimeout(() => {
        if (!isHovered) {
          setIsMinimized(true);
          setTimeout(() => setShowLoader(false), 500);
        }
      }, 1000); // Delay before auto-minimizing on mouse leave
    }
  };  return (
    <header 
      className={`relative text-center transition-all duration-700 ease-in-out cursor-pointer overflow-hidden ${
        theme === 'dark' 
          ? 'glass-dark bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30 text-white border border-white/10' 
          : 'glass-light bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-indigo-50/80 text-gray-800 border border-black/5'
      } ${
        isMinimized 
          ? 'mb-2 md:mb-4 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-2xl' 
          : 'mb-4 md:mb-8 py-8 md:py-12 rounded-2xl shadow-xl'
      } ${hasAutoMinimized ? 'hover:scale-[1.01] active:scale-[0.99]' : ''} backdrop-blur-xl`}
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={isMinimized && hasAutoMinimized ? "Click or hover to expand" : ""}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 opacity-20 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600' 
          : 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400'
      }`} />
      
      {/* Theme toggle - positioned absolutely */}
      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4">        <h1 
          className={`font-bold transition-all duration-700 ease-in-out bg-gradient-to-r from-current via-current to-current bg-clip-text ${
            isMinimized 
              ? 'text-xl md:text-3xl mb-0' 
              : 'text-3xl md:text-6xl mb-3 md:mb-6'
          } ${theme === 'dark' ? 'text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300' : 'text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'}`}
        >
          {isMinimized ? "PNG, AVIF & JPEG to WebP" : title}
          {isMinimized && hasAutoMinimized && (
            <span className={`ml-3 text-base transition-all duration-300 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
            } ${isHovered ? 'animate-bounce' : 'animate-pulse'}`}>
              {isHovered ? "▲" : "▼"}
            </span>
          )}
        </h1>
        
        {/* Animated content that fades out */}
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isMinimized 
              ? 'max-h-0 opacity-0 pointer-events-none transform scale-95' 
              : 'max-h-96 opacity-100 transform scale-100'
          }`}
        >
          {showLoader && (
            <>
              <p className={`text-base md:text-2xl mb-6 md:mb-8 font-medium leading-relaxed ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {subtitle}
              </p>
              <div className={`text-sm md:text-lg max-w-4xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p className="mb-6 md:mb-8 leading-relaxed">
                  Transform your PNG, AVIF, and JPEG images into the modern WebP format with our free, 
                  browser-based converter. No uploads required - all processing happens securely in your browser.
                </p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm">
                  <span className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-green-300 border border-green-400/30 hover:bg-green-400/20' 
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}>✓ 100% Free</span>
                  <span className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-blue-300 border border-blue-400/30 hover:bg-blue-400/20' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}>✓ No Server Upload</span>
                  <span className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-purple-300 border border-purple-400/30 hover:bg-purple-400/20' 
                      : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                  }`}>✓ Instant Results</span>
                  <span className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-400/20' 
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                  }`}>✓ Quality Control</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Loading animation dots - only show during initial load */}
        {!isMinimized && (
          <div className="flex justify-center mt-6 md:mt-8">
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full animate-bounce ${
                theme === 'dark' ? 'bg-blue-400/60' : 'bg-blue-500/60'
              }`} style={{ animationDelay: '0ms' }}></div>
              <div className={`w-3 h-3 rounded-full animate-bounce ${
                theme === 'dark' ? 'bg-purple-400/60' : 'bg-purple-500/60'
              }`} style={{ animationDelay: '150ms' }}></div>
              <div className={`w-3 h-3 rounded-full animate-bounce ${
                theme === 'dark' ? 'bg-indigo-400/60' : 'bg-indigo-500/60'
              }`} style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "PNG, AVIF & JPEG to WebP",
  subtitle = "Convert your images to WebP format instantly - reduce file sizes by up to 90%"
}) => {
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
      className={`text-center transition-all duration-700 ease-in-out bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 rounded-lg shadow-lg cursor-pointer ${
        isMinimized 
          ? 'mb-2 md:mb-4 py-2 md:py-3 hover:shadow-xl' 
          : 'mb-4 md:mb-8 py-6 md:py-10'
      } ${hasAutoMinimized ? 'hover:scale-[1.02]' : ''}`}
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={isMinimized && hasAutoMinimized ? "Click or hover to expand" : ""}
    >
      <div className="max-w-4xl mx-auto">        <h1 
          className={`font-bold transition-all duration-700 ease-in-out ${
            isMinimized 
              ? 'text-lg md:text-2xl mb-0' 
              : 'text-2xl md:text-5xl mb-2 md:mb-4'
          }`}
        >
          {isMinimized ? "PNG, AVIF & JPEG to WebP" : title}
          {isMinimized && hasAutoMinimized && (
            <span className="ml-2 text-sm opacity-70 animate-pulse">
              {isHovered ? "▲" : "▼"}
            </span>
          )}
        </h1>
        
        {/* Animated content that fades out */}
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isMinimized 
              ? 'max-h-0 opacity-0 pointer-events-none' 
              : 'max-h-96 opacity-100'
          }`}
        >
          {showLoader && (
            <>
              <p className="text-sm md:text-xl mb-4 md:mb-6 opacity-90">
                {subtitle}
              </p>
              <div className="text-xs md:text-base opacity-80 max-w-3xl mx-auto">
                <p className="mb-3 md:mb-4">
                  Transform your PNG, AVIF, and JPEG images into the modern WebP format with our free, 
                  browser-based converter. No uploads required - all processing happens securely in your browser.
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs">
                  <span className="bg-white/20 px-2 md:px-3 py-1 rounded-full">✓ 100% Free</span>
                  <span className="bg-white/20 px-2 md:px-3 py-1 rounded-full">✓ No Server Upload</span>
                  <span className="bg-white/20 px-2 md:px-3 py-1 rounded-full">✓ Instant Results</span>
                  <span className="bg-white/20 px-2 md:px-3 py-1 rounded-full">✓ Quality Control</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Loading animation dots - only show during initial load */}
        {!isMinimized && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

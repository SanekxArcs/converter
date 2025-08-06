import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`relative overflow-hidden mt-auto rounded-2xl p-6 md:p-8 text-center transition-all duration-300 ${
      theme === 'dark' 
        ? 'glass-dark border border-white/10' 
        : 'glass-light border border-black/5'
    } backdrop-blur-xl`}>
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 opacity-5 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600' 
          : 'bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400'
      }`} />
      
      <div className="relative space-y-4">
        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs md:text-sm font-medium ${
            theme === 'dark' ? 'bg-white/10 text-blue-300' : 'bg-blue-50 text-blue-700'
          }`}>
            <span>⚡</span>
            <span>Vite</span>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs md:text-sm font-medium ${
            theme === 'dark' ? 'bg-white/10 text-cyan-300' : 'bg-cyan-50 text-cyan-700'
          }`}>
            <span>⚛️</span>
            <span>React</span>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs md:text-sm font-medium ${
            theme === 'dark' ? 'bg-white/10 text-blue-300' : 'bg-blue-50 text-blue-700'
          }`}>
            <span>📘</span>
            <span>TypeScript</span>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs md:text-sm font-medium ${
            theme === 'dark' ? 'bg-white/10 text-teal-300' : 'bg-teal-50 text-teal-700'
          }`}>
            <span>🎨</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
        
        {/* Creator */}
        <div className={`text-sm md:text-base ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <p>Created with ❤️ by <span className={`font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent`}>Sanekx Arcs</span></p>
        </div>
        
        {/* Additional Info */}
        <div className={`text-xs md:text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p>🔒 Privacy-first • 🚀 Fast • 💯 Free • 🌐 Open Source</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

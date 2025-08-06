import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface FileUploadZoneProps {
  dragActive: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: () => void;
  acceptedFormats: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  acceptedFormats
}) => {
  const { theme } = useTheme();
  // Check if device likely supports drag and drop (desktop)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return (
    <div
      className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-6 md:p-12 text-center transition-all duration-300 ease-in-out transform hover:scale-[1.01] active:scale-[0.99] ${
        dragActive
          ? theme === 'dark'
            ? 'border-blue-400 glass-dark bg-blue-900/20 shadow-2xl shadow-blue-500/20'
            : 'border-blue-500 glass-light bg-blue-50/80 shadow-2xl shadow-blue-500/20'
          : theme === 'dark'
            ? 'border-gray-600 glass-dark hover:border-gray-500 hover:shadow-xl'
            : 'border-gray-300 glass-light hover:border-gray-400 hover:shadow-xl'
      } backdrop-blur-xl`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 opacity-10 ${
        dragActive
          ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500'
          : theme === 'dark'
            ? 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700'
            : 'bg-gradient-to-br from-gray-100 via-white to-gray-100'
      }`} />
      
      <div className="relative space-y-4 md:space-y-6">
        {/* Animated upload icon */}
        <div className={`text-5xl md:text-8xl transition-all duration-300 ${
          dragActive ? 'animate-bounce scale-110' : 'animate-pulse'
        } ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {dragActive ? '📤' : '📁'}
        </div>
        
        <div className="space-y-3 md:space-y-4">
          {isMobile ? (
            // Mobile layout - emphasize the button
            <>
              <div className="space-y-2">
                <h3 className={`text-lg md:text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Select Your Images
                </h3>
                <p className={`text-sm md:text-base font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Choose your {acceptedFormats} files
                </p>
              </div>
              
              <button
                onClick={onFileSelect}
                className={`group relative overflow-hidden px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-lg md:text-xl w-full max-w-sm mx-auto block transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500'
                    : 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>📱</span>
                  <span>Choose Files</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <p className={`text-xs md:text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Tap to browse and select multiple files
              </p>
            </>
          ) : (
            // Desktop layout - keep drag and drop
            <>
              <div className="space-y-2">
                <h3 className={`text-xl md:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  {dragActive ? 'Drop Your Files Here!' : 'Upload Your Images'}
                </h3>
                <p className={`text-sm md:text-lg font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Drag & drop your {acceptedFormats} files here
                </p>
              </div>
              
              <div className={`flex items-center space-x-4 justify-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="h-px bg-current flex-1 opacity-30" />
                <span className="text-sm md:text-base font-medium">or</span>
                <div className="h-px bg-current flex-1 opacity-30" />
              </div>
              
              <button
                onClick={onFileSelect}
                className={`group relative overflow-hidden px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500'
                    : 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>🖱️</span>
                  <span>Browse Files</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </>
          )}
          
          {/* Supported formats */}
          <div className={`text-xs md:text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p>Supported formats: PNG, AVIF, JPEG, GIF</p>
            <p className="mt-1">✨ All processing happens in your browser - no uploads!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;

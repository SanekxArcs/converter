import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface QualityControlProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  onConvert: () => void;
  isConverting: boolean;
  fileCount: number;
}

const QualityControl: React.FC<QualityControlProps> = ({
  quality,
  onQualityChange,
  onConvert,
  isConverting,
  fileCount
}) => {
  const { theme } = useTheme();
  
  const getQualityColor = () => {
    if (quality <= 30) return theme === 'dark' ? 'text-red-400' : 'text-red-600';
    if (quality <= 60) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    return theme === 'dark' ? 'text-green-400' : 'text-green-600';
  };
  
  const getQualityGradient = () => {
    if (quality <= 30) return 'from-red-500 to-red-600';
    if (quality <= 60) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };
  
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl ${
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
      
      <div className="relative">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 rounded-xl ${
            theme === 'dark' ? 'bg-white/10' : 'bg-black/5'
          }`}>
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className={`text-xl md:text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Quality Settings
          </h3>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className={`text-base md:text-lg font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Quality Level
              </label>
              <div className={`px-4 py-2 rounded-xl font-bold text-lg ${getQualityColor()} ${
                theme === 'dark' ? 'bg-white/10' : 'bg-black/5'
              }`}>
                {quality}%
              </div>
            </div>

            {/* Quality Preset Buttons */}
            <div className="grid grid-cols-5 gap-2 md:gap-3 mb-6">
              <button
                onClick={() => onQualityChange(10)}
                className={`px-3 py-2 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  quality === 10
                    ? `bg-gradient-to-r ${getQualityGradient()} text-white shadow-lg`
                    : theme === 'dark'
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                      : 'bg-black/5 text-gray-600 hover:bg-black/10 border border-black/10'
                }`}
              >
                Min
              </button>
              <button
                onClick={() => onQualityChange(Math.max(10, quality - 5))}
                className={`px-3 py-2 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    : 'bg-black/5 text-gray-600 hover:bg-black/10 border border-black/10'
                }`}
              >
                -5%
              </button>
              <button
                onClick={() => onQualityChange(80)}
                className={`px-3 py-2 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  quality === 80
                    ? `bg-gradient-to-r ${getQualityGradient()} text-white shadow-lg`
                    : theme === 'dark'
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                      : 'bg-black/5 text-gray-600 hover:bg-black/10 border border-black/10'
                }`}
              >
                Default
              </button>
              <button
                onClick={() => onQualityChange(Math.min(100, quality + 5))}
                className={`px-3 py-2 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    : 'bg-black/5 text-gray-600 hover:bg-black/10 border border-black/10'
                }`}
              >
                +5%
              </button>
              <button
                onClick={() => onQualityChange(100)}
                className={`px-3 py-2 md:py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  quality === 100
                    ? `bg-gradient-to-r ${getQualityGradient()} text-white shadow-lg`
                    : theme === 'dark'
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                      : 'bg-black/5 text-gray-600 hover:bg-black/10 border border-black/10'
                }`}
              >
                Max
              </button>
            </div>

            {/* Custom Slider */}
            <div className="relative mb-4">
              <div className={`h-3 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${getQualityGradient()} transition-all duration-300 relative`}
                  style={{ width: `${((quality - 10) / 90) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-current animate-pulse" />
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => onQualityChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            <div className={`flex justify-between text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center space-x-2">
                <span>📉</span>
                <span>Smaller size</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Higher quality</span>
                <span>📈</span>
              </div>
            </div>
          </div>
          
          {/* Convert Button */}
          <button
            onClick={onConvert}
            disabled={isConverting || fileCount === 0}
            className={`group relative overflow-hidden w-full py-4 md:py-5 px-6 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl disabled:transform-none disabled:hover:scale-100 ${
              isConverting || fileCount === 0
                ? theme === 'dark'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center space-x-3">
              {isConverting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Convert {fileCount} Image{fileCount > 1 ? "s" : ""} to WebP</span>
                </>
              )}
            </span>
            {!isConverting && fileCount > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityControl;

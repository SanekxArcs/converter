import React from 'react';

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
  return (
    <div className="mt-2 md:mt-6 p-2 bg-gray-50 rounded-lg">
      <h3 className="text-sm md:text-lg font-medium text-gray-800 mb-2">
        Quality Settings
      </h3>
      <div className="space-y-2">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Quality: {quality}%
          </label>

          {/* Quality Preset Buttons */}
          <div className="flex flex-wrap justify-between gap-1 md:gap-2 mb-2 md:mb-3">
            <button
              onClick={() => onQualityChange(10)}
              className={`px-2 py-1 flex-1 text-xs rounded-md transition-colors ${
                quality === 10
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Min
            </button>
            <button
              onClick={() => onQualityChange(Math.max(10, quality - 5))}
              className="px-2 py-1 flex-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
            >
              -5%
            </button>
            <button
              onClick={() => onQualityChange(80)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                quality === 80
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Default
            </button>
            <button
              onClick={() => onQualityChange(Math.min(100, quality + 5))}
              className="px-2 flex-1 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
            >
              +5%
            </button>
            <button
              onClick={() => onQualityChange(100)}
              className={`px-2 py-1 flex-1 text-xs rounded-md transition-colors ${
                quality === 100
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Max
            </button>
          </div>

          <div className="relative">
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => onQualityChange(Number(e.target.value))}
              className="w-full slider"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                  ((quality - 10) / 90) * 100
                }%, #e5e7eb ${((quality - 10) / 90) * 100}%, #e5e7eb 100%)`,
                height: "8px",
                borderRadius: "8px",
                outline: "none",
                WebkitAppearance: "none",
                appearance: "none",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-0.5 md:mt-1">
            <span>Lower size</span>
            <span>Higher quality</span>
          </div>
        </div>
        <button
          onClick={onConvert}
          disabled={isConverting || fileCount === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-3 md:px-6 rounded-lg font-medium transition-colors text-xs md:text-base"
        >
          {isConverting
            ? "Converting..."
            : `Convert ${fileCount} Image${fileCount > 1 ? "s" : ""} to WebP`}
        </button>
      </div>
    </div>
  );
};

export default QualityControl;

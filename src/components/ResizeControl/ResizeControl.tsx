import React, { useState, useEffect } from 'react';

export interface ResizeSettings {
  enabled: boolean;
  width: number;
  height: number;
  aspectRatio: 'preserve' | 'free' | 'square';
}

interface ResizeControlProps {
  resizeSettings: ResizeSettings;
  onResizeSettingsChange: (settings: ResizeSettings) => void;
}

const ResizeControl: React.FC<ResizeControlProps> = ({
  resizeSettings,
  onResizeSettingsChange
}) => {
  const [localWidth, setLocalWidth] = useState(resizeSettings.width.toString());
  const [localHeight, setLocalHeight] = useState(resizeSettings.height.toString());

  useEffect(() => {
    setLocalWidth(resizeSettings.width.toString());
    setLocalHeight(resizeSettings.height.toString());
  }, [resizeSettings.width, resizeSettings.height]);

  const handleWidthChange = (value: string) => {
    setLocalWidth(value);
    const width = parseInt(value) || 0;
    let height = resizeSettings.height;

    if (resizeSettings.aspectRatio === 'preserve' && width > 0) {
      // Calculate height based on original aspect ratio (assuming 16:9 as default)
      height = Math.round((width * 9) / 16);
    } else if (resizeSettings.aspectRatio === 'square') {
      height = width;
    }

    onResizeSettingsChange({
      ...resizeSettings,
      width,
      height
    });
  };

  const handleHeightChange = (value: string) => {
    setLocalHeight(value);
    const height = parseInt(value) || 0;
    let width = resizeSettings.width;

    if (resizeSettings.aspectRatio === 'preserve' && height > 0) {
      // Calculate width based on original aspect ratio (assuming 16:9 as default)
      width = Math.round((height * 16) / 9);
    } else if (resizeSettings.aspectRatio === 'square') {
      width = height;
    }

    onResizeSettingsChange({
      ...resizeSettings,
      width,
      height
    });
  };

  const handleAspectRatioChange = (aspectRatio: 'preserve' | 'free' | 'square') => {
    const newSettings = { ...resizeSettings, aspectRatio };

    if (aspectRatio === 'square') {
      const size = Math.max(resizeSettings.width, resizeSettings.height);
      newSettings.width = size;
      newSettings.height = size;
    }

    onResizeSettingsChange(newSettings);
  };

  return (
    <div className="mt-2 md:mt-4 p-2 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm md:text-lg font-medium text-gray-800">Resize Images</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={resizeSettings.enabled}
            onChange={(e) => onResizeSettingsChange({ ...resizeSettings, enabled: e.target.checked })}
            className="mr-2"
          />
          <span className="text-xs md:text-sm text-gray-700">Enable resize</span>
        </label>
      </div>

      {resizeSettings.enabled && (
        <div className="space-y-3">
          {/* Aspect Ratio Selection */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Aspect Ratio
            </label>
            <div className="flex flex-wrap gap-1 md:gap-2">
              <button
                onClick={() => handleAspectRatioChange('preserve')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  resizeSettings.aspectRatio === 'preserve'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Preserve
              </button>
              <button
                onClick={() => handleAspectRatioChange('square')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  resizeSettings.aspectRatio === 'square'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                1:1 Square
              </button>
              <button
                onClick={() => handleAspectRatioChange('free')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  resizeSettings.aspectRatio === 'free'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Free
              </button>
            </div>
          </div>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={localWidth}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full px-2 py-1 text-xs md:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="10000"
                placeholder="Width"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={localHeight}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full px-2 py-1 text-xs md:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="10000"
                placeholder="Height"
                disabled={resizeSettings.aspectRatio === 'square'}
              />
            </div>
          </div>

          {/* Quick Size Presets */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-1 md:gap-2">
              <button
                onClick={() => onResizeSettingsChange({ ...resizeSettings, width: 1920, height: 1080 })}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
              >
                1920×1080
              </button>
              <button
                onClick={() => onResizeSettingsChange({ ...resizeSettings, width: 1280, height: 720 })}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
              >
                1280×720
              </button>
              <button
                onClick={() => onResizeSettingsChange({ ...resizeSettings, width: 800, height: 600 })}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
              >
                800×600
              </button>
              <button
                onClick={() => onResizeSettingsChange({ ...resizeSettings, width: 512, height: 512 })}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
              >
                512×512
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResizeControl;

import React, { useState } from 'react';
import type { ConversionSettings, ExifData } from '../../types';
import { getReadableExifInfo, hasSensitiveExifData } from '../../services/exifService';

interface ExifControlProps {
  conversionSettings: ConversionSettings;
  onSettingsChange: (settings: ConversionSettings) => void;
  selectedFilesExif?: ExifData[];
}

const ExifControl: React.FC<ExifControlProps> = ({
  conversionSettings,
  onSettingsChange,
  selectedFilesExif = []
}) => {
  const [showExifData, setShowExifData] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const hasExifData = selectedFilesExif.length > 0 && selectedFilesExif.some(exif => exif && Object.keys(exif).length > 0);
  const currentExif = selectedFilesExif[selectedFileIndex];
  const hasSensitiveData = currentExif ? hasSensitiveExifData(currentExif) : false;

  const handlePreserveExifChange = (preserve: boolean) => {
    onSettingsChange({
      ...conversionSettings,
      preserveExif: preserve,
      stripExif: !preserve
    });
  };

  const handleStripExifChange = (strip: boolean) => {
    onSettingsChange({
      ...conversionSettings,
      stripExif: strip,
      preserveExif: !strip
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">EXIF Data Settings</h3>
        {hasExifData && (
          <button
            onClick={() => setShowExifData(!showExifData)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showExifData ? 'Hide' : 'Show'} EXIF Data
          </button>
        )}
      </div>

      {!hasExifData ? (
        <div className="text-gray-600 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            No EXIF data found in selected images. EXIF settings will not affect the conversion.
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {/* EXIF Preservation Options */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="preserve-exif"
                  name="exif-option"
                  checked={conversionSettings.preserveExif}
                  onChange={(e) => handlePreserveExifChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="preserve-exif" className="ml-3 text-sm font-medium text-gray-700">
                  Preserve EXIF data
                </label>
              </div>
              <p className="ml-7 text-xs text-gray-500">
                Keep camera settings, date taken, and other metadata in the converted image.
                {hasSensitiveData && (
                  <span className="text-orange-600 font-medium">
                    {' '}⚠️ Warning: This includes GPS location data.
                  </span>
                )}
              </p>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="strip-exif"
                  name="exif-option"
                  checked={conversionSettings.stripExif}
                  onChange={(e) => handleStripExifChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="strip-exif" className="ml-3 text-sm font-medium text-gray-700">
                  Remove EXIF data
                </label>
              </div>
              <p className="ml-7 text-xs text-gray-500">
                Strip all metadata for privacy and smaller file size. Recommended for web publishing.
              </p>
            </div>

            {/* Sensitive Data Warning */}
            {hasSensitiveData && conversionSettings.preserveExif && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-orange-800">Privacy Warning</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Your images contain GPS location data. Consider removing EXIF data before sharing online to protect your privacy.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EXIF Data Display */}
          {showExifData && currentExif && (
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">EXIF Data Preview</h4>
                {selectedFilesExif.length > 1 && (
                  <select
                    value={selectedFileIndex}
                    onChange={(e) => setSelectedFileIndex(parseInt(e.target.value))}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    {selectedFilesExif.map((_, index) => (
                      <option key={index} value={index}>
                        File {index + 1}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                {(() => {
                  const readableExif = getReadableExifInfo(currentExif);
                  const entries = Object.entries(readableExif);
                  
                  if (entries.length === 0) {
                    return (
                      <p className="text-gray-500 text-sm">No readable EXIF data available for this image.</p>
                    );
                  }
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {entries.map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-1">
                          <span className="text-sm font-medium text-gray-600">{key}:</span>
                          <span className="text-sm text-gray-800 ml-2 truncate">{value}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              
              {hasSensitiveData && (
                <div className="mt-3 text-xs text-orange-600">
                  ⚠️ This image contains GPS location data
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExifControl;
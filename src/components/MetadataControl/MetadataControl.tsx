import React, { useState } from 'react';
import type { ImageMetadata } from '../../types';
import { 
  validateMetadata, 
  cleanMetadata, 
  saveMetadataToLocalStorage, 
  loadMetadataFromLocalStorage, 
  clearMetadataFromLocalStorage, 
  hasMetadataInLocalStorage 
} from '../../utils/metadataUtils';

interface MetadataControlProps {
  metadata: ImageMetadata;
  onMetadataChange: (metadata: ImageMetadata) => void;
}

const MetadataControl: React.FC<MetadataControlProps> = ({
  metadata,
  onMetadataChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFieldChange = (field: keyof ImageMetadata, value: string) => {
    const newMetadata = {
      ...metadata,
      [field]: value
    };
    
    // Validate and clean metadata
    const errors = validateMetadata(newMetadata);
    setValidationErrors(errors);
    
    onMetadataChange(cleanMetadata(newMetadata));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = metadata.keywords || [];
      onMetadataChange({
        ...metadata,
        keywords: [...currentKeywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const currentKeywords = metadata.keywords || [];
    onMetadataChange({
      ...metadata,
      keywords: currentKeywords.filter((_, i) => i !== index)
    });
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSaveMetadata = () => {
    saveMetadataToLocalStorage(metadata);
    // You could add a toast notification here
  };

  const handleLoadMetadata = () => {
    const savedMetadata = loadMetadataFromLocalStorage();
    onMetadataChange(savedMetadata);
    setValidationErrors([]);
  };

  const handleClearSavedMetadata = () => {
    clearMetadataFromLocalStorage();
    // You could add a toast notification here
  };

  return (
    <div className="mt-2 md:mt-4 p-2 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm md:text-lg font-medium text-gray-800">Image Metadata</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? 'Hide' : 'Show'} Metadata
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {/* Author */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={metadata.author || ''}
              onChange={(e) => handleFieldChange('author', e.target.value)}
              className="w-full px-2 py-1 text-xs md:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter author name"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={metadata.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-2 py-1 text-xs md:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter image title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={metadata.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full px-2 py-1 text-xs md:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Enter image description"
              rows={2}
            />
          </div>

          {/* Copyright */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Copyright
            </label>
            <input
              type="text"
              value={metadata.copyright || ''}
              onChange={(e) => handleFieldChange('copyright', e.target.value)}
              className="w-full px-2 py-1 text-xs md:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="© 2025 Your Name"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Keywords/Tags
            </label>
            <div className="flex gap-1 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                className="flex-1 px-2 py-1 text-xs md:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add keyword"
              />
              <button
                onClick={handleAddKeyword}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            {metadata.keywords && metadata.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {metadata.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Templates */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Quick Templates
            </label>
            <div className="flex flex-wrap gap-1 md:gap-2">
              <button
                onClick={() => handleFieldChange('author', 'Your Name')}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
              >
                Add Your Name
              </button>
              <button
                onClick={() => handleFieldChange('copyright', `© ${new Date().getFullYear()} Your Name`)}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition-colors"
              >
                Current Year ©
              </button>
              <button
                onClick={() => {
                  onMetadataChange({});
                  setValidationErrors([]);
                }}
                className="px-2 py-1 text-xs bg-red-200 text-red-700 hover:bg-red-300 rounded-md transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Local Storage Controls */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Save & Load Metadata
            </label>
            <div className="flex flex-wrap gap-1 md:gap-2">
              <button
                onClick={handleSaveMetadata}
                className="px-2 py-1 text-xs bg-green-200 text-green-700 hover:bg-green-300 rounded-md transition-colors"
              >
                💾 Save to Browser
              </button>
              <button
                onClick={handleLoadMetadata}
                disabled={!hasMetadataInLocalStorage()}
                className="px-2 py-1 text-xs bg-blue-200 text-blue-700 hover:bg-blue-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                📂 Load Saved
              </button>
              <button
                onClick={handleClearSavedMetadata}
                disabled={!hasMetadataInLocalStorage()}
                className="px-2 py-1 text-xs bg-orange-200 text-orange-700 hover:bg-orange-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                🗑️ Clear Saved
              </button>
            </div>
            {hasMetadataInLocalStorage() && (
              <p className="text-xs text-gray-500 mt-1">
                ✓ Saved metadata available in browser storage
              </p>
            )}
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mt-2 p-2 bg-red-50 rounded-md">
              <p className="text-xs font-medium text-red-700 mb-1">Validation Errors:</p>
              {validationErrors.map((error, index) => (
                <p key={index} className="text-xs text-red-600">• {error}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MetadataControl;

import React from 'react';
import type { ConvertedImage } from '../../types';
import { formatFileSize } from '../../utils/fileUtils';

interface ConversionResultItemProps {
  convertedImage: ConvertedImage;
  onDownload: (convertedImage: ConvertedImage) => void;
}

const ConversionResultItem: React.FC<ConversionResultItemProps> = ({
  convertedImage,
  onDownload
}) => {
  const getOriginalFileType = (mimeType: string): string => {
    switch (mimeType) {
      case 'image/png': return 'PNG';
      case 'image/avif': return 'AVIF';
      case 'image/jpeg': return 'JPEG';
      default: return 'Image';
    }
  };
  return (    <div className="bg-white p-2 rounded-lg">
      <h4 className="font-medium text-gray-700 mb-2 text-xs md:text-base">
        {convertedImage.originalFile.name.replace(/\.(png|avif|jpe?g)$/i, '.webp')}
      </h4>

      {/* Metadata Display */}
      {convertedImage.metadata && Object.values(convertedImage.metadata).some(Boolean) && (
        <div className="mb-2 p-2 bg-gray-50 rounded-md">
          <p className="text-xs font-medium text-gray-600 mb-1">Metadata:</p>
          {convertedImage.metadata.author && (
            <p className="text-xs text-gray-600">
              <span className="font-medium">Author:</span> {convertedImage.metadata.author}
            </p>
          )}
          {convertedImage.metadata.title && (
            <p className="text-xs text-gray-600">
              <span className="font-medium">Title:</span> {convertedImage.metadata.title}
            </p>
          )}
          {convertedImage.metadata.copyright && (
            <p className="text-xs text-gray-600">
              <span className="font-medium">Copyright:</span> {convertedImage.metadata.copyright}
            </p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">
            Original {getOriginalFileType(convertedImage.originalFile.type)}
          </p>
          <img
            src={URL.createObjectURL(convertedImage.originalFile)}
            alt="Original"
            className="w-full h-12 md:h-20 object-cover rounded-md mb-1"
          />
          <p className="text-xs text-gray-500">
            {formatFileSize(convertedImage.originalSize)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">WebP</p>
          <img
            src={URL.createObjectURL(convertedImage.webpBlob)}
            alt="Converted"
            className="w-full h-12 md:h-20 object-cover rounded-md mb-1"
          />
          <p className="text-xs text-gray-500">
            {formatFileSize(convertedImage.webpSize)}
          </p>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">Compression:</span>
          <span className="text-xs font-bold text-green-600">
            {convertedImage.compressionRatio.toFixed(1)}% smaller
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, convertedImage.compressionRatio)}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onDownload(convertedImage)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md font-medium transition-colors text-xs md:text-sm"
      >
        Download WebP
      </button>
    </div>
  );
};

export default ConversionResultItem;

import React, { useState } from 'react';
import type { ConvertedImage } from '../../types';
import ConversionResultItem from './ConversionResultItem';
import ImageComparison from '../ImageComparison/ImageComparison';

interface ConversionResultsProps {
  convertedImages: ConvertedImage[];
  onDownloadSingle: (convertedImage: ConvertedImage) => void;
  onDownloadAll: () => void;
  onDownloadZip: () => void;
}

const ConversionResults: React.FC<ConversionResultsProps> = ({
  convertedImages,
  onDownloadSingle,
  onDownloadAll,
  onDownloadZip
}) => {
  const [comparisonImage, setComparisonImage] = useState<ConvertedImage | null>(null);

  const handleCompareImage = (convertedImage: ConvertedImage) => {
    setComparisonImage(convertedImage);
  };

  const handleCloseComparison = () => {
    setComparisonImage(null);
  };

  if (convertedImages.length === 0) return null;
  return (    <div className="mt-2 md:mt-6 p-2 bg-green-50 rounded-lg">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
        <h3 className="text-sm md:text-lg font-medium text-gray-800">
          Conversion Results ({convertedImages.length})
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={onDownloadAll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm"
          >
            Download All
          </button>
          <button
            onClick={onDownloadZip}
            className="bg-purple-600 hover:bg-purple-700 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm"
          >
            Download ZIP
          </button>
        </div>
      </div>

      <div className="grid gap-2 md:gap-6 md:grid-cols-2">
        {convertedImages.map((convertedImage) => (
          <ConversionResultItem
            key={convertedImage.id}
            convertedImage={convertedImage}
            onDownload={onDownloadSingle}
            onCompare={handleCompareImage}
          />
        ))}
      </div>
      
      {comparisonImage && (
        <ImageComparison
          convertedImage={comparisonImage}
          onClose={handleCloseComparison}
        />
      )}
    </div>
  );
};

export default ConversionResults;

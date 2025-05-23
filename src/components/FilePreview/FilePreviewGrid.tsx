import React from 'react';
import type { SelectedFile } from '../../types';
import { formatFileSize } from '../../utils/fileUtils';

interface FilePreviewGridProps {
  selectedFiles: SelectedFile[];
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
}

const FilePreviewGrid: React.FC<FilePreviewGridProps> = ({
  selectedFiles,
  onRemoveFile,
  onClearAll
}) => {
  if (selectedFiles.length === 0) return null;
  return (    <div className="mt-2 md:mt-6 p-2 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm md:text-lg font-medium text-gray-800">
          Selected Files ({selectedFiles.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium"
        >
          Clear All
        </button>
      </div>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">        {selectedFiles.map((selectedFile) => (
          <div key={selectedFile.id} className="relative bg-white p-2 rounded-lg shadow">
            <button
              onClick={() => onRemoveFile(selectedFile.id)}
              className="absolute top-0.5 right-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center text-xs z-10"
            >
              ×
            </button>
            <img
              src={selectedFile.preview}
              alt="Preview"
              className="w-full h-12 md:h-24 object-cover rounded-lg mb-1"
            />
            <div className="text-xs">
              <p className="font-medium text-gray-800 truncate" title={selectedFile.file.name}>
                {selectedFile.file.name}
              </p>
              <p className="text-gray-600">
                {formatFileSize(selectedFile.file.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilePreviewGrid;

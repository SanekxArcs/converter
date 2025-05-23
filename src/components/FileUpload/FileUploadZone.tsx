import React from 'react';

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
  return (    <div      className={`border-2 border-dashed rounded-lg p-2 md:p-8 text-center transition-colors ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >      <div className="space-y-1 md:space-y-4">
        <div className="text-2xl md:text-6xl text-gray-400">📁</div>
        <div>
          <p className="text-xs md:text-lg font-medium text-gray-700 mb-1 md:mb-2">
            Drag & drop your {acceptedFormats} files here
          </p>
          <p className="text-gray-500 mb-1 md:mb-4 text-xs md:text-sm">or</p>
          <button
            onClick={onFileSelect}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-base"
          >
            Choose Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;

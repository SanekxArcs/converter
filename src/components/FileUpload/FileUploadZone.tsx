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
  // Check if device likely supports drag and drop (desktop)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-3 md:p-8 text-center transition-colors ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="space-y-2 md:space-y-4">
        <div className="text-3xl md:text-6xl text-gray-400">📁</div>
        <div>
          {isMobile ? (
            // Mobile layout - emphasize the button
            <>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select your {acceptedFormats} files
              </p>
              <button
                onClick={onFileSelect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg w-full max-w-xs mx-auto block shadow-lg"
              >
                Choose Files
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Tap to browse and select multiple files
              </p>
            </>
          ) : (
            // Desktop layout - keep drag and drop
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;

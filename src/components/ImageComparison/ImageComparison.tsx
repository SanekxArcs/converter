import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ConvertedImage } from '../../types';

interface ImageComparisonProps {
  convertedImage: ConvertedImage;
  onClose: () => void;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({ convertedImage, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showSplit, setShowSplit] = useState(true);
  const [splitPosition, setSplitPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);
  const convertedImageRef = useRef<HTMLImageElement>(null);

  // Create object URLs for images
  const originalUrl = URL.createObjectURL(convertedImage.originalFile);
  const convertedUrl = URL.createObjectURL(convertedImage.webpBlob);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(originalUrl);
      URL.revokeObjectURL(convertedUrl);
    };
  }, [originalUrl, convertedUrl]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.1));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  }, [zoomLevel, panPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel(prev => Math.max(0.1, Math.min(5, prev * delta)));
  }, []);

  const handleSplitDrag = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPosition(Math.max(0, Math.min(100, newPosition)));
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Image Comparison</h2>
          <div className="text-sm text-gray-300">
            {convertedImage.originalFile.name}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSplit(!showSplit)}
              className={`px-3 py-1 rounded text-sm ${
                showSplit ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Split View
            </button>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
            >
              -
            </button>
            <span className="text-sm min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
            >
              +
            </button>
            <button
              onClick={handleZoomReset}
              className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
            >
              Reset
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {showSplit ? (
          // Split view
          <div className="relative w-full h-full">
            {/* Original Image */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
            >
              <img
                ref={originalImageRef}
                src={originalUrl}
                alt="Original"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transformOrigin: 'center'
                }}
                draggable={false}
              />
            </div>
            
            {/* Converted Image */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
            >
              <img
                ref={convertedImageRef}
                src={convertedUrl}
                alt="Converted"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transformOrigin: 'center'
                }}
                draggable={false}
              />
            </div>
            
            {/* Split Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-lg"
              style={{ left: `${splitPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={(e) => {
                e.preventDefault();
                const handleMouseMove = (e: MouseEvent) => handleSplitDrag(e as any);
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
              Original ({formatFileSize(convertedImage.originalSize)})
            </div>
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
              WebP ({formatFileSize(convertedImage.webpSize)}) - {convertedImage.compressionRatio.toFixed(1)}% smaller
            </div>
          </div>
        ) : (
          // Side by side view
          <div className="flex w-full h-full">
            <div className="flex-1 relative overflow-hidden">
              <img
                ref={originalImageRef}
                src={originalUrl}
                alt="Original"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transformOrigin: 'center'
                }}
                draggable={false}
              />
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                Original ({formatFileSize(convertedImage.originalSize)})
              </div>
            </div>
            
            <div className="w-px bg-gray-600"></div>
            
            <div className="flex-1 relative overflow-hidden">
              <img
                ref={convertedImageRef}
                src={convertedUrl}
                alt="Converted"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transformOrigin: 'center'
                }}
                draggable={false}
              />
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                WebP ({formatFileSize(convertedImage.webpSize)}) - {convertedImage.compressionRatio.toFixed(1)}% smaller
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with stats */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <span>Quality: {convertedImage.quality}%</span>
            <span>Compression: {convertedImage.compressionRatio.toFixed(1)}%</span>
            <span>Size Reduction: {formatFileSize(convertedImage.originalSize - convertedImage.webpSize)}</span>
          </div>
          <div className="text-gray-400">
            Use mouse wheel to zoom • Drag to pan when zoomed • Drag the white line to adjust split
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
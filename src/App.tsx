import React, { useState, useRef, useCallback } from 'react';
import Header from './components/Header/Header';
import SEO from './components/SEO/SEO';
import FileUploadZone from './components/FileUpload/FileUploadZone';
import FilePreviewGrid from './components/FilePreview/FilePreviewGrid';
import QualityControl from './components/QualityControl/QualityControl';
import ConversionResults from './components/ConversionResults/ConversionResults';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import Footer from './components/Footer/Footer';
import { useFileManagement } from './hooks/useFileManagement';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { convertMultipleImages } from './services/conversionService';
import { downloadSingleFile, downloadMultipleFiles, downloadAsZip } from './services/downloadService';
import { SUPPORTED_EXTENSIONS } from './types';

function App() {
  const [quality, setQuality] = useState<number>(80);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFiles,
    convertedImages,
    error,
    addFiles,
    removeFile,
    clearAllFiles,
    clearError,
    setConvertedImages,
    setError
  } = useFileManagement();

  const { dragActive, handleDrag, handleDrop } = useDragAndDrop(addFiles);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  }, [addFiles, clearError]);

  const handleConversion = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsConverting(true);
    setError('');

    try {
      const converted = await convertMultipleImages(selectedFiles, quality);
      setConvertedImages(converted);
    } catch {
      setError('Error converting images. Please try again.');
    } finally {
      setIsConverting(false);
    }
  }, [selectedFiles, quality, setConvertedImages, setError]);

  const handleDownloadAll = useCallback(() => {
    downloadMultipleFiles(convertedImages);
  }, [convertedImages]);

  const handleDownloadZip = useCallback(async () => {
    try {
      await downloadAsZip(convertedImages);
    } catch {
      setError('Error creating ZIP file. Please try again.');
    }
  }, [convertedImages, setError]);

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 md:p-6 flex flex-col">
        <div className="max-w-4xl flex flex-col mx-auto flex-1 w-full">
          <Header />

        <div className="bg-white rounded-xl flex-1 shadow-lg p-2 md:p-8 mb-2 md:mb-6">
          <FileUploadZone
            dragActive={dragActive}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onFileSelect={() => fileInputRef.current?.click()}
            acceptedFormats="PNG, AVIF & JPEG"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept={SUPPORTED_EXTENSIONS.join(',')}
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <ErrorDisplay 
            error={error} 
            onDismiss={clearError}
          />

          <FilePreviewGrid
            selectedFiles={selectedFiles}
            onRemoveFile={removeFile}
            onClearAll={clearAllFiles}
          />

          {selectedFiles.length > 0 && (
            <QualityControl
              quality={quality}
              onQualityChange={setQuality}
              onConvert={handleConversion}
              isConverting={isConverting}
              fileCount={selectedFiles.length}
            />
          )}

          <ConversionResults
            convertedImages={convertedImages}
            onDownloadSingle={downloadSingleFile}
            onDownloadAll={handleDownloadAll}
            onDownloadZip={handleDownloadZip}
          />
        </div>

        <Footer />
        </div>
      </div>
    </>
  );
}

export default App;

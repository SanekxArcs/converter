import React, { useState, useRef, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Header from './components/Header/Header';
import SEO from './components/SEO/SEO';
import FileUploadZone from './components/FileUpload/FileUploadZone';
import FilePreviewGrid from './components/FilePreview/FilePreviewGrid';
import QualityControl from './components/QualityControl/QualityControl';
import ResizeControl, { type ResizeSettings } from './components/ResizeControl/ResizeControl';
import MetadataControl from './components/MetadataControl/MetadataControl';
import ExifControl from './components/ExifControl/ExifControl';
import ConversionResults from './components/ConversionResults/ConversionResults';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import Footer from './components/Footer/Footer';
import PWAStatus from './components/PWAStatus/PWAStatus';
import { ToastContainer } from './components/Toast/ToastContainer';
import { FloatingThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { BatchProgress } from './components/ProgressBar/ProgressBar';
import { useFileManagement } from './hooks/useFileManagement';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useToast } from './contexts/ToastContext';
import { convertMultipleImages } from './services/conversionService';
import { downloadSingleFile, downloadMultipleFiles, downloadAsZip } from './services/downloadService';
import { SUPPORTED_EXTENSIONS } from './types';
import type { ImageMetadata, ConversionSettings, ExifData } from './types';

function AppContent() {
  const [quality, setQuality] = useState<number>(80);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionProgress, setConversionProgress] = useState<Array<{
    name: string;
    progress: number;
    status: 'pending' | 'processing' | 'completed' | 'error';
  }>>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const { success, error: showError } = useToast();
  const [resizeSettings, setResizeSettings] = useState<ResizeSettings>({
    enabled: false,
    width: 1920,
    height: 1080,
    aspectRatio: 'preserve'
  });
  const [metadata, setMetadata] = useState<ImageMetadata>({});
  const [conversionSettings, setConversionSettings] = useState<ConversionSettings>({
    preserveExif: false,
    stripExif: true
  });
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
    
    // Initialize progress tracking
    const progressItems = selectedFiles.map(file => ({
      name: file.file.name,
      progress: 0,
      status: 'pending' as const
    }));
    setConversionProgress(progressItems);
    setOverallProgress(0);

    try {
      const converted = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Update current file status to processing
        setConversionProgress(prev => prev.map((item, index) => 
          index === i ? { ...item, status: 'processing', progress: 0 } : item
        ));
        
        try {
          // Simulate progress updates
          for (let progress = 0; progress <= 100; progress += 20) {
            setConversionProgress(prev => prev.map((item, index) => 
              index === i ? { ...item, progress } : item
            ));
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          const result = await convertMultipleImages([file], quality, resizeSettings, metadata, conversionSettings);
          converted.push(...result);
          
          // Mark as completed
          setConversionProgress(prev => prev.map((item, index) => 
            index === i ? { ...item, status: 'completed', progress: 100 } : item
          ));
          
          // Update overall progress
          setOverallProgress(((i + 1) / selectedFiles.length) * 100);
          
        } catch (fileError) {
          setConversionProgress(prev => prev.map((item, index) => 
            index === i ? { ...item, status: 'error', progress: 0 } : item
          ));
          showError(`Failed to convert ${file.file.name}`, 'Please try again or check the file format.');
        }
      }
      
      setConvertedImages(converted);
      
      if (converted.length > 0) {
        success(
          `Successfully converted ${converted.length} image${converted.length > 1 ? 's' : ''}!`,
          `Total size reduction: ${Math.round((1 - converted.reduce((acc, img) => acc + img.webpSize, 0) / selectedFiles.reduce((acc, file) => acc + file.file.size, 0)) * 100)}%`
        );
      }
      
    } catch (err) {
      setError('Error converting images. Please try again.');
      showError('Conversion failed', 'An unexpected error occurred during conversion.');
    } finally {
      setIsConverting(false);
    }
  }, [selectedFiles, quality, resizeSettings, metadata, conversionSettings, setConvertedImages, setError, success, showError]);

  const handleDownloadAll = useCallback(() => {
    downloadMultipleFiles(convertedImages);
    success('Download started!', `Downloading ${convertedImages.length} converted images.`);
  }, [convertedImages, success]);

  const handleDownloadZip = useCallback(async () => {
    try {
      await downloadAsZip(convertedImages);
      success('ZIP download started!', `Creating archive with ${convertedImages.length} images.`);
    } catch {
      setError('Error creating ZIP file. Please try again.');
    }
  }, [convertedImages, setError, success]);

  return (
    <>
      <SEO />
      <div className="min-h-[100svh] bg-gradient-to-br from-blue-50 to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-300 p-2 md:p-6 flex flex-col">
        <div className="max-w-4xl flex flex-col mx-auto flex-1 w-full">
          <Header />

        <div className="bg-white dark:bg-gray-800 rounded-xl flex-1 shadow-lg p-2 md:p-8 mb-2 md:mb-6 transition-colors duration-300">
          <div className="glass dark:glass-dark rounded-3xl p-6 card-hover mb-8">
            <FileUploadZone
              dragActive={dragActive}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onFileSelect={() => fileInputRef.current?.click()}
              acceptedFormats="PNG, AVIF, JPEG & GIF"
            />
          </div>

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

          {selectedFiles.length > 0 && (
            <>
              <div className="glass dark:glass-dark rounded-3xl p-6 card-hover mb-8">
                <FilePreviewGrid
                  selectedFiles={selectedFiles}
                  onRemoveFile={removeFile}
                  onClearAll={clearAllFiles}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="glass dark:glass-dark rounded-3xl p-6 card-hover">
                  <QualityControl
                    quality={quality}
                    onQualityChange={setQuality}
                    onConvert={handleConversion}
                    isConverting={isConverting}
                    fileCount={selectedFiles.length}
                  />
                </div>
                
                <div className="glass dark:glass-dark rounded-3xl p-6 card-hover">
                  <ResizeControl
                    resizeSettings={resizeSettings}
                    onResizeSettingsChange={setResizeSettings}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="glass dark:glass-dark rounded-3xl p-6 card-hover">
                  <MetadataControl
                    metadata={metadata}
                    onMetadataChange={setMetadata}
                  />
                </div>
                
                <div className="glass dark:glass-dark rounded-3xl p-6 card-hover">
                  <ExifControl
                    conversionSettings={conversionSettings}
                    onSettingsChange={setConversionSettings}
                    selectedFilesExif={selectedFiles.map(file => file.exifData).filter(Boolean) as ExifData[]}
                  />
                </div>
              </div>
              
              {/* Progress Section */}
              {isConverting && conversionProgress.length > 0 && (
                <div className="mb-8">
                  <BatchProgress
                    files={conversionProgress}
                    overallProgress={overallProgress}
                  />
                </div>
              )}
            </>
          )}

          {convertedImages.length > 0 && (
            <div className="glass dark:glass-dark rounded-3xl p-6 card-hover">
              <ConversionResults
                convertedImages={convertedImages}
                onDownloadSingle={downloadSingleFile}
                onDownloadAll={handleDownloadAll}
                onDownloadZip={handleDownloadZip}
              />
            </div>
          )}
        </div>

        <Footer />
        </div>
        
        <PWAStatus />
        <FloatingThemeToggle />
        <ToastContainer />
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

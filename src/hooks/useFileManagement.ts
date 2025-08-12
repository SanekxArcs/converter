import React from 'react';
import type { SelectedFile, ConvertedImage } from '../types';
import { generateUniqueId } from '../utils/fileUtils';
import { isValidImageFile } from '../services/conversionService';
import { extractExifData } from '../services/exifService';

export const useFileManagement = () => {
  const [selectedFiles, setSelectedFiles] = React.useState<SelectedFile[]>([]);
  const [convertedImages, setConvertedImages] = React.useState<ConvertedImage[]>([]);
  const [error, setError] = React.useState<string>('');

  const validateAndProcessFiles = React.useCallback((files: File[]) => {
    const supportedFiles = files.filter(isValidImageFile);
    
    if (supportedFiles.length === 0) {
      setError('Please select PNG, AVIF, JPEG, or GIF files only.');
      return [];
    }

    if (files.length > supportedFiles.length) {
      setError(`${files.length - supportedFiles.length} unsupported files were ignored. Only PNG, AVIF, JPEG, and GIF files are supported.`);
    }

    return supportedFiles;
  }, []);

  const addFiles = React.useCallback(async (files: File[]) => {
    const validFiles = validateAndProcessFiles(files);
    
    if (validFiles.length === 0) return;

    // Process files with EXIF data extraction
    const newFiles: SelectedFile[] = await Promise.all(
      validFiles.map(async (file) => {
        try {
          const exifData = await extractExifData(file);
          return {
            id: generateUniqueId(),
            file,
            preview: URL.createObjectURL(file),
            exifData: exifData || undefined
          };
        } catch (error) {
          console.error(`EXIF extraction failed for ${file.name}:`, error);
          return {
            id: generateUniqueId(),
            file,
            preview: URL.createObjectURL(file),
            exifData: undefined
          };
        }
      })
    );

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setConvertedImages([]);
  }, [validateAndProcessFiles]);

  const removeFile = React.useCallback((id: string) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(file => file.id !== id);
    });
    setConvertedImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const clearAllFiles = React.useCallback(() => {
    selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setSelectedFiles([]);
    setConvertedImages([]);
  }, [selectedFiles]);

  const clearError = React.useCallback(() => {
    setError('');
  }, []);

  return {
    selectedFiles,
    convertedImages,
    error,
    addFiles,
    removeFile,
    clearAllFiles,
    clearError,
    setConvertedImages,
    setError
  };
};

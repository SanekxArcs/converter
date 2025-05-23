import { useState, useCallback } from 'react';
import type { SelectedFile, ConvertedImage } from '../types';
import { generateUniqueId } from '../utils/fileUtils';
import { isValidImageFile } from '../services/conversionService';

export const useFileManagement = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [error, setError] = useState<string>('');

  const validateAndProcessFiles = useCallback((files: File[]) => {
    const supportedFiles = files.filter(isValidImageFile);
    
    if (supportedFiles.length === 0) {
      setError('Please select PNG, AVIF, or JPEG files only.');
      return [];
    }

    if (files.length > supportedFiles.length) {
      setError(`${files.length - supportedFiles.length} unsupported files were ignored. Only PNG, AVIF, and JPEG files are supported.`);
    }

    return supportedFiles;
  }, []);

  const addFiles = useCallback((files: File[]) => {
    const validFiles = validateAndProcessFiles(files);
    if (validFiles.length === 0) return;

    const newFiles: SelectedFile[] = validFiles.map(file => ({
      id: generateUniqueId(),
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setConvertedImages([]);
  }, [validateAndProcessFiles]);

  const removeFile = useCallback((id: string) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(file => file.id !== id);
    });
    setConvertedImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const clearAllFiles = useCallback(() => {
    selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setSelectedFiles([]);
    setConvertedImages([]);
  }, [selectedFiles]);

  const clearError = useCallback(() => {
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

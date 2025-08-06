import type { SelectedFile, ConvertedImage, ImageMetadata, ConversionSettings } from '../types';
import type { ResizeSettings } from '../components/ResizeControl/ResizeControl';
import { SUPPORTED_MIME_TYPES } from '../types';
import { prepareExifForWebP } from './exifService';

export const convertImageToWebP = async (
  selectedFile: SelectedFile, 
  quality: number,
  resizeSettings?: ResizeSettings,
  metadata?: ImageMetadata,
  conversionSettings?: ConversionSettings
): Promise<ConvertedImage | null> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;

        // Apply resizing if enabled
        if (resizeSettings?.enabled && resizeSettings.width > 0 && resizeSettings.height > 0) {
          if (resizeSettings.aspectRatio === 'preserve') {
            // Calculate dimensions while preserving aspect ratio
            const aspectRatio = img.width / img.height;
            const targetAspectRatio = resizeSettings.width / resizeSettings.height;
            
            if (aspectRatio > targetAspectRatio) {
              targetWidth = resizeSettings.width;
              targetHeight = Math.round(resizeSettings.width / aspectRatio);
            } else {
              targetWidth = Math.round(resizeSettings.height * aspectRatio);
              targetHeight = resizeSettings.height;
            }
          } else {
            // Free or square aspect ratio
            targetWidth = resizeSettings.width;
            targetHeight = resizeSettings.height;
          }
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
        resolve();
      };
      img.onerror = reject;
      img.src = selectedFile.preview;
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality / 100);
    });

    if (!blob) return null;

    const originalSize = selectedFile.file.size;
    const webpSize = blob.size;
    const compressionRatio = ((originalSize - webpSize) / originalSize * 100);

    // Handle EXIF data if settings are provided
    let originalExif = selectedFile.exifData;
    let preservedExif = false;
    
    if (conversionSettings?.preserveExif && originalExif) {
      // Prepare EXIF data for WebP (limited support)
      const webpExif = prepareExifForWebP(originalExif);
      preservedExif = Object.keys(webpExif).length > 0;
      // Note: Actual EXIF embedding in WebP would require additional libraries
      // For now, we'll store the EXIF data in our result object
    }

    return {
      id: selectedFile.id,
      originalFile: selectedFile.file,
      originalSize,
      webpBlob: blob,
      webpSize,
      compressionRatio,
      quality,
      metadata,
      originalExif,
      preservedExif
    };
  } catch (error) {
    console.error('Error converting image:', error);
    return null;
  }
};

export const convertMultipleImages = async (
  selectedFiles: SelectedFile[],
  quality: number,
  resizeSettings?: ResizeSettings,
  metadata?: ImageMetadata,
  conversionSettings?: ConversionSettings,
  onProgress?: (current: number, total: number) => void
): Promise<ConvertedImage[]> => {
  const converted: ConvertedImage[] = [];

  for (let i = 0; i < selectedFiles.length; i++) {
    const result = await convertImageToWebP(selectedFiles[i], quality, resizeSettings, metadata, conversionSettings);
    if (result) {
      converted.push(result);
    }
    onProgress?.(i + 1, selectedFiles.length);
  }

  return converted;
};

export const isValidImageFile = (file: File): boolean => {
  return SUPPORTED_MIME_TYPES.includes(file.type as typeof SUPPORTED_MIME_TYPES[number]);
};

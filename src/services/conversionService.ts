import type { SelectedFile, ConvertedImage } from '../types';
import { SUPPORTED_MIME_TYPES } from '../types';

export const convertImageToWebP = async (
  selectedFile: SelectedFile, 
  quality: number
): Promise<ConvertedImage | null> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
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

    return {
      id: selectedFile.id,
      originalFile: selectedFile.file,
      originalSize,
      webpBlob: blob,
      webpSize,
      compressionRatio,
      quality
    };
  } catch (error) {
    console.error('Error converting image:', error);
    return null;
  }
};

export const convertMultipleImages = async (
  selectedFiles: SelectedFile[],
  quality: number,
  onProgress?: (current: number, total: number) => void
): Promise<ConvertedImage[]> => {
  const converted: ConvertedImage[] = [];

  for (let i = 0; i < selectedFiles.length; i++) {
    const result = await convertImageToWebP(selectedFiles[i], quality);
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

export interface ConvertedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  webpBlob: Blob;
  webpSize: number;
  compressionRatio: number;
  quality: number;
}

export interface SelectedFile {
  id: string;
  file: File;
  preview: string;
}

export const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/avif', 
  'image/jpeg'
] as const;

export const SUPPORTED_EXTENSIONS = [
  '.png',
  '.avif', 
  '.jpg',
  '.jpeg'
] as const;

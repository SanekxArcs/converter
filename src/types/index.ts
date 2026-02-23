export interface ImageMetadata {
  author?: string;
  title?: string;
  description?: string;
  copyright?: string;
  keywords?: string[];
}

export interface ExifData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ConversionSettings {
  preserveExif: boolean;
  stripExif: boolean;
  sanitizeExif: boolean;
}

export interface NamingSettings {
  customName: string;
  addNumber: boolean;
  addDate: boolean;
  addTime: boolean;
}

export interface ConvertedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  webpBlob: Blob;
  webpSize: number;
  compressionRatio: number;
  quality: number;
  metadata?: ImageMetadata;
  originalExif?: ExifData;
  preservedExif?: boolean;
}

export interface SelectedFile {
  id: string;
  file: File;
  preview: string;
  exifData?: ExifData;
  autoMetadata?: ImageMetadata;
}

export const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/avif', 
  'image/jpeg',
  'image/gif'
] as const;

export const SUPPORTED_EXTENSIONS = [
  '.png',
  '.avif', 
  '.jpg',
  '.jpeg',
  '.gif'
] as const;

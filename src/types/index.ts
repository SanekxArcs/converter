export interface ImageMetadata {
  author?: string;
  title?: string;
  description?: string;
  copyright?: string;
  keywords?: string[];
}

export interface ExifData {
  [key: string]: any;
}

export interface ConversionSettings {
  preserveExif: boolean;
  stripExif: boolean;
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
}

export interface ComparisonViewSettings {
  enabled: boolean;
  zoomLevel: number;
  showOriginal: boolean;
  showConverted: boolean;
  splitView: boolean;
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

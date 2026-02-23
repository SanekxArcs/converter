import EXIF from 'exif-js';
import type { ExifData } from '../types';

/**
 * Extract EXIF data from an image file safely using ArrayBuffer path
 * to avoid issues in exif-js image onload handler for certain files.
 */
export const extractExifData = async (file: File): Promise<ExifData | null> => {
  // Only attempt EXIF on JPEG/TIFF where EXIF is expected
  const supportedForExif = file.type === 'image/jpeg' || file.type === 'image/tiff';
  if (!supportedForExif) {
    return null;
  }

  try {
    const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });

    // Use exif-js binary parser directly to avoid DOM Image onload path
    let tags: any = {};
    try {
      tags = EXIF.readFromBinaryFile(buffer) || {};
    } catch (e) {
      // Parsing failed; return null gracefully
      return null;
    }

    // Clean up the EXIF data and convert to a more usable format
    const cleanedExifData: ExifData = {};
    for (const [key, value] of Object.entries(tags)) {
      if (value !== undefined && value !== null) {
        cleanedExifData[key] = value;
      }
    }

    return Object.keys(cleanedExifData).length > 0 ? cleanedExifData : null;
  } catch (error) {
    console.warn('EXIF extraction failed (binary):', error);
    return null;
  }
};

/**
 * Get human-readable EXIF information
 */
export const getReadableExifInfo = (exifData: ExifData): Record<string, string> => {
  const readable: Record<string, string> = {};
  
  // Camera information
  if (exifData.Make) readable['Camera Make'] = exifData.Make;
  if (exifData.Model) readable['Camera Model'] = exifData.Model;
  
  // Photo settings
  if (exifData.FNumber) readable['Aperture'] = `f/${exifData.FNumber}`;
  if (exifData.ExposureTime) {
    const exposure = exifData.ExposureTime as number;
    readable['Shutter Speed'] = exposure < 1 ? `1/${Math.round(1/exposure)}s` : `${exposure}s`;
  }
  if (exifData.ISOSpeedRatings) readable['ISO'] = (exifData.ISOSpeedRatings as any).toString();
  if (exifData.FocalLength) readable['Focal Length'] = `${exifData.FocalLength}mm`;
  
  // Image dimensions
  if (exifData.PixelXDimension) readable['Width'] = `${exifData.PixelXDimension}px`;
  if (exifData.PixelYDimension) readable['Height'] = `${exifData.PixelYDimension}px`;
  
  // Date and time
  if (exifData.DateTime) readable['Date Taken'] = exifData.DateTime as string;
  if (exifData.DateTimeOriginal) readable['Original Date'] = exifData.DateTimeOriginal as string;
  
  // GPS information
  if (exifData.GPSLatitude && exifData.GPSLongitude) {
    readable['GPS Coordinates'] = `${exifData.GPSLatitude}, ${exifData.GPSLongitude}`;
  }
  
  // Software
  if (exifData.Software) readable['Software'] = exifData.Software as string;
  
  return readable;
};

/**
 * Check if EXIF data contains sensitive information (GPS, etc.)
 */
export const hasSensitiveExifData = (exifData: ExifData): boolean => {
  const sensitiveFields = [
    'GPSLatitude',
    'GPSLongitude', 
    'GPSAltitude',
    'GPSTimeStamp',
    'GPSDateStamp'
  ];
  
  return sensitiveFields.some(field => exifData[field] !== undefined);
};

/**
 * Remove sensitive EXIF data while preserving technical camera data
 */
export const sanitizeExifData = (exifData: ExifData): ExifData => {
  const sanitized = { ...exifData };

  // Remove GPS data
  const gpsFields = [
    "GPSLatitude",
    "GPSLongitude",
    "GPSAltitude",
    "GPSTimeStamp",
    "GPSDateStamp",
    "GPSLatitudeRef",
    "GPSLongitudeRef",
    "GPSAltitudeRef",
    "GPSMapDatum",
    "GPSProcessingMethod",
    "GPSAreaInformation",
  ];

  gpsFields.forEach((field) => {
    delete sanitized[field];
  });

  // Optionally remove timestamp data
  delete sanitized.DateTime;
  delete sanitized.DateTimeOriginal;
  delete sanitized.DateTimeDigitized;

  return sanitized;
};

/**
 * Convert EXIF data to a format that can be embedded in WebP
 * Note: WebP has limited EXIF support, so we'll focus on essential data
 */
export const prepareExifForWebP = (exifData: ExifData): ExifData => {
  const webpCompatible: ExifData = {};
  
  // Essential fields that WebP can handle
  const compatibleFields = [
    'Make', 'Model', 'Software', 'DateTime',
    'FNumber', 'ExposureTime', 'ISOSpeedRatings', 'FocalLength',
    'PixelXDimension', 'PixelYDimension', 'Orientation'
  ];
  
  compatibleFields.forEach(field => {
    if (exifData[field] !== undefined) {
      webpCompatible[field] = exifData[field];
    }
  });
  
  return webpCompatible;
};
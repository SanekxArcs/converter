import type { ImageMetadata } from '../types';

/**
 * Generate automatic metadata based on file information
 */
export const generateAutoMetadata = (file: File): ImageMetadata => {
  const fileName = file.name.replace(/\.(png|avif|jpe?g)$/i, '');
  
  return {
    title: fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `Image file: ${fileName}`,
    keywords: fileName.toLowerCase().split(/[-_\s]+/).filter(Boolean)
  };
};

/**
 * Merge user metadata with auto-generated metadata
 */
export const mergeMetadata = (userMetadata: ImageMetadata, autoMetadata: ImageMetadata): ImageMetadata => {
  return {
    ...autoMetadata,
    ...userMetadata, // User metadata takes precedence
    keywords: [
      ...(autoMetadata.keywords || []),
      ...(userMetadata.keywords || [])
    ].filter((keyword, index, arr) => arr.indexOf(keyword) === index) // Remove duplicates
  };
};

/**
 * Validate metadata fields
 */
export const validateMetadata = (metadata: ImageMetadata): string[] => {
  const errors: string[] = [];
  
  if (metadata.author && metadata.author.length > 100) {
    errors.push('Author name is too long (max 100 characters)');
  }
  
  if (metadata.title && metadata.title.length > 200) {
    errors.push('Title is too long (max 200 characters)');
  }
  
  if (metadata.description && metadata.description.length > 500) {
    errors.push('Description is too long (max 500 characters)');
  }
  
  if (metadata.keywords && metadata.keywords.length > 20) {
    errors.push('Too many keywords (max 20)');
  }
  
  return errors;
};

/**
 * Clean metadata by removing empty values
 */
export const cleanMetadata = (metadata: ImageMetadata): ImageMetadata => {
  const cleaned: ImageMetadata = {};
  
  if (metadata.author?.trim()) cleaned.author = metadata.author.trim();
  if (metadata.title?.trim()) cleaned.title = metadata.title.trim();
  if (metadata.description?.trim()) cleaned.description = metadata.description.trim();
  if (metadata.copyright?.trim()) cleaned.copyright = metadata.copyright.trim();
  if (metadata.keywords?.length) cleaned.keywords = metadata.keywords.filter(k => k.trim());
  
  return cleaned;
};

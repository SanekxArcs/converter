import JSZip from 'jszip';
import type { ConvertedImage } from '../types';
import { replaceFileExtension } from '../utils/fileUtils';

export const downloadSingleFile = (convertedImage: ConvertedImage): void => {
  const url = URL.createObjectURL(convertedImage.webpBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = replaceFileExtension(convertedImage.originalFile.name, '.webp');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadMultipleFiles = (convertedImages: ConvertedImage[]): void => {
  convertedImages.forEach((convertedImage, index) => {
    setTimeout(() => downloadSingleFile(convertedImage), index * 100);
  });
};

export const downloadAsZip = async (convertedImages: ConvertedImage[]): Promise<void> => {
  if (convertedImages.length === 0) return;

  const zip = new JSZip();
  
  convertedImages.forEach(convertedImage => {
    const fileName = replaceFileExtension(convertedImage.originalFile.name, '.webp');
    zip.file(fileName, convertedImage.webpBlob);
  });

  try {
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-webp-images-${new Date().getTime()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw new Error('Error creating ZIP file. Please try again.');
  }
};

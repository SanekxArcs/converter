import JSZip from 'jszip';
import type { ConvertedImage } from '../types';
import { replaceFileExtension } from '../utils/fileUtils';
import type { NamingSettings } from '../types';

export const generateFileName = (
  convertedImage: ConvertedImage,
  settings?: NamingSettings,
  index?: number,
): string => {
  let fileName = replaceFileExtension(
    convertedImage.originalFile.name,
    ".webp",
  );

  if (settings && settings.customName.trim()) {
    fileName = `${settings.customName.trim()}.webp`;
  }

  const parts: string[] = [];
  const nameWithoutExt = fileName.replace(/\.webp$/, "");
  parts.push(nameWithoutExt);

  if (settings) {
    if (settings.addNumber && typeof index === "number") {
      parts.push(`${index + 1}`);
    }
    if (settings.addDate) {
      parts.push(new Date().toISOString().split("T")[0]);
    }
    if (settings.addTime) {
      const time = new Date().toLocaleTimeString("en-GB").replace(/:/g, "-");
      parts.push(time);
    }
  }

  // If no custom name and no settings, just use the original filename (which is already in parts[0])
  // But if there are extra parts, join them
  if (parts.length > 1) {
    fileName = `${parts.join("_")}.webp`;
  }

  return fileName;
};

export const downloadSingleFile = (convertedImage: ConvertedImage, settings?: NamingSettings, index?: number): void => {
  const url = URL.createObjectURL(convertedImage.webpBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = generateFileName(convertedImage, settings, index);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadMultipleFiles = (convertedImages: ConvertedImage[], settings?: NamingSettings): void => {
  convertedImages.forEach((convertedImage, index) => {
    setTimeout(() => downloadSingleFile(convertedImage, settings, index), index * 100);
  });
};

export const downloadAsZip = async (convertedImages: ConvertedImage[], settings?: NamingSettings): Promise<void> => {
  if (convertedImages.length === 0) return;

  const zip = new JSZip();
  
  convertedImages.forEach((convertedImage, index) => {
    const fileName = generateFileName(convertedImage, settings, index);
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

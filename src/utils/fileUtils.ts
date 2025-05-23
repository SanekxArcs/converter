export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getFileExtension = (filename: string): string => {
  return filename.substring(filename.lastIndexOf('.'));
};

export const replaceFileExtension = (filename: string, newExtension: string): string => {
  return filename.replace(/\.(png|avif|jpe?g)$/i, newExtension);
};

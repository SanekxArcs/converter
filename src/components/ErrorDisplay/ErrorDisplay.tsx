import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (    <div className="bg-red-100 border border-red-400 text-red-700 px-2 md:px-4 py-2 md:py-3 rounded mb-2 md:mb-4 flex justify-between items-center">
      <span>{error}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-700 hover:text-red-900 ml-2 md:ml-4"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;

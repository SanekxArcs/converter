import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default',
  animated = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const getVariantClasses = () => {
    const baseGradient = animated ? 'bg-gradient-to-r' : 'bg-gradient-to-r';
    
    switch (variant) {
      case 'success':
        return `${baseGradient} from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400`;
      case 'warning':
        return `${baseGradient} from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400`;
      case 'error':
        return `${baseGradient} from-red-500 to-rose-500 dark:from-red-400 dark:to-rose-400`;
      default:
        return `${baseGradient} from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400`;
    }
  };
  
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`
        w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden
        ${sizeClasses[size]}
        shadow-inner
      `}>
        <div
          className={`
            ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out
            ${getVariantClasses()}
            ${animated ? 'animate-pulse' : ''}
            relative overflow-hidden
          `}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
};

// Batch Progress Component for multiple files
interface BatchProgressProps {
  files: Array<{
    name: string;
    progress: number;
    status: 'pending' | 'processing' | 'completed' | 'error';
  }>;
  overallProgress: number;
  className?: string;
}

export const BatchProgress: React.FC<BatchProgressProps> = ({
  files,
  overallProgress,
  className = ''
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'processing':
        return (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return (
          <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
        );
    }
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'error': return 'error';
      case 'processing': return 'default';
      default: return 'default';
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conversion Progress
        </h3>
        <ProgressBar
          progress={overallProgress}
          label="Overall Progress"
          size="lg"
          animated={overallProgress < 100}
        />
      </div>
      
      {/* Individual File Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          File Details ({files.filter(f => f.status === 'completed').length}/{files.length})
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex-shrink-0">
                {getStatusIcon(file.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </p>
                <div className="mt-1">
                  <ProgressBar
                    progress={file.progress}
                    showPercentage={false}
                    size="sm"
                    variant={getStatusVariant(file.status)}
                    animated={file.status === 'processing'}
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {Math.round(file.progress)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
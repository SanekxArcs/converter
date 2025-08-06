import React from 'react';
import { useToast, type Toast, type ToastType } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast();
  const { isDark } = useTheme();

  const getToastStyles = (type: ToastType) => {
    const baseStyles = 'transform transition-all duration-300 ease-in-out';
    const darkMode = isDark ? 'dark:' : '';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-emerald-500 to-green-500 ${darkMode}from-emerald-600 ${darkMode}to-green-600`;
      case 'error':
        return `${baseStyles} bg-gradient-to-r from-red-500 to-rose-500 ${darkMode}from-red-600 ${darkMode}to-rose-600`;
      case 'warning':
        return `${baseStyles} bg-gradient-to-r from-amber-500 to-orange-500 ${darkMode}from-amber-600 ${darkMode}to-orange-600`;
      case 'info':
        return `${baseStyles} bg-gradient-to-r from-blue-500 to-indigo-500 ${darkMode}from-blue-600 ${darkMode}to-indigo-600`;
      default:
        return `${baseStyles} bg-gradient-to-r from-gray-500 to-slate-500`;
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`
      ${getToastStyles(toast.type)}
      text-white p-4 rounded-2xl shadow-2xl backdrop-blur-sm
      border border-white/20 max-w-sm w-full
      animate-slide-in-right hover:scale-105 transition-transform
      relative overflow-hidden
    `}>
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="p-1 bg-white/20 rounded-full backdrop-blur-sm">
            {getIcon(toast.type)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold leading-5 truncate">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="mt-1 text-xs opacity-90 leading-4">
              {toast.message}
            </p>
          )}
        </div>
        
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
        <div className="h-full bg-white/60 animate-progress-bar" />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-h-screen overflow-hidden">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
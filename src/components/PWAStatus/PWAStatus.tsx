import React, { useState, useEffect } from 'react';
import { pwaService } from '../../services/pwaService';

const PWAStatus: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isOnline, setIsOnline] = useState(pwaService.getIsOnline());
  const [isInstalled, setIsInstalled] = useState(pwaService.getIsInstalled());
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    quota: number;
    usedPercentage: number;
  } | null>(null);

  useEffect(() => {
    // Set initial state
    setCanInstall(pwaService.canInstall());
    setIsInstalled(pwaService.getIsInstalled());

    // Setup callbacks
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInstallChange = (canInstall: boolean) => {
      setCanInstall(canInstall);
      if (canInstall && !isInstalled) {
        setShowInstallPrompt(true);
      }
    };

    pwaService.onOnline(handleOnline);
    pwaService.onOffline(handleOffline);
    pwaService.onInstallStatusChange(handleInstallChange);

    // Get storage info
    pwaService.getStorageUsage().then(setStorageInfo);

    // Cleanup
    return () => {
      pwaService.removeOnlineCallback(handleOnline);
      pwaService.removeOfflineCallback(handleOffline);
      pwaService.removeInstallCallback(handleInstallChange);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    const installed = await pwaService.promptInstall();
    if (installed) {
      setIsInstalled(true);
      setCanInstall(false);
      setShowInstallPrompt(false);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
  };

  const handleShare = async () => {
    const shared = await pwaService.shareApp();
    if (!shared) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin);
        alert('App URL copied to clipboard!');
      } catch {
        alert('Share not supported. URL: ' + window.location.origin);
      }
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-600 text-white px-4 py-2 text-center text-sm z-50">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>You're offline. The app will continue to work with cached data.</span>
          </div>
        </div>
      )}

      {/* Install Prompt */}
      {showInstallPrompt && canInstall && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white rounded-lg shadow-lg p-4 z-40">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Install WebP Converter</h3>
              <p className="text-xs mt-1 opacity-90">
                Install this app for faster access and offline functionality.
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={handleDismissInstall}
                  className="text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismissInstall}
              className="flex-shrink-0 text-white hover:bg-blue-700 rounded p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* PWA Status Indicator */}
      <div className="fixed bottom-4 left-4 z-30">
        <div className="flex flex-col space-y-2">
          {/* Online/Offline Status */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
            isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-orange-500'
            }`}></div>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Install Status */}
          {isInstalled && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Installed</span>
            </div>
          )}

          {/* Storage Info */}
          {storageInfo && storageInfo.quota > 0 && (
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
              <span>Storage: {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.quota)}</span>
              {storageInfo.usedPercentage > 80 && (
                <span className="text-orange-600 ml-1">⚠️</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Button (when installed) */}
      {isInstalled && (
        <div className="fixed bottom-4 right-4 z-30">
          <button
            onClick={handleShare}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
            title="Share this app"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default PWAStatus;
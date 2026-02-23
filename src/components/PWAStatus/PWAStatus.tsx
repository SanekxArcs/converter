import React, { useReducer, useEffect } from "react";
import { pwaService } from "../../services/pwaService";

interface StorageInfo {
  used: number;
  quota: number;
  usedPercentage: number;
}

interface PWAState {
  canInstall: boolean;
  isOnline: boolean;
  isInstalled: boolean;
  showInstallPrompt: boolean;
  storageInfo: StorageInfo | null;
}

type PWAAction =
  | { type: "SET_ONLINE"; payload: boolean }
  | {
      type: "SET_INSTALL_STATUS";
      payload: { canInstall: boolean; isInstalled: boolean };
    }
  | { type: "SET_STORAGE_INFO"; payload: StorageInfo }
  | { type: "DISMISS_PROMPT" }
  | { type: "INSTALL_SUCCESS" };

const pwaReducer = (state: PWAState, action: PWAAction): PWAState => {
  switch (action.type) {
    case "SET_ONLINE":
      return { ...state, isOnline: action.payload };
    case "SET_INSTALL_STATUS":
      return {
        ...state,
        canInstall: action.payload.canInstall,
        isInstalled: action.payload.isInstalled,
        showInstallPrompt:
          action.payload.canInstall && !action.payload.isInstalled,
      };
    case "SET_STORAGE_INFO":
      return { ...state, storageInfo: action.payload };
    case "DISMISS_PROMPT":
      return { ...state, showInstallPrompt: false };
    case "INSTALL_SUCCESS":
      return {
        ...state,
        isInstalled: true,
        canInstall: false,
        showInstallPrompt: false,
      };
    default:
      return state;
  }
};

const PWAStatus: React.FC = () => {
  const [state, dispatch] = useReducer(pwaReducer, {
    canInstall: false,
    isOnline: true, // Will be initialized in useEffect
    isInstalled: false, // Will be initialized in useEffect
    showInstallPrompt: false,
    storageInfo: null,
  });

  useEffect(() => {
    // Set initial state
    dispatch({
      type: "SET_INSTALL_STATUS",
      payload: {
        canInstall: pwaService.canInstall(),
        isInstalled: pwaService.getIsInstalled(),
      },
    });
    dispatch({ type: "SET_ONLINE", payload: pwaService.getIsOnline() });

    // Setup callbacks
    const handleOnline = () => dispatch({ type: "SET_ONLINE", payload: true });
    const handleOffline = () =>
      dispatch({ type: "SET_ONLINE", payload: false });
    const handleInstallChange = (canInstall: boolean) => {
      dispatch({
        type: "SET_INSTALL_STATUS",
        payload: { canInstall, isInstalled: pwaService.getIsInstalled() },
      });
    };

    pwaService.onOnline(handleOnline);
    pwaService.onOffline(handleOffline);
    pwaService.onInstallStatusChange(handleInstallChange);

    // Get storage info
    pwaService.getStorageUsage().then((info) => {
      if (info) dispatch({ type: "SET_STORAGE_INFO", payload: info });
    });

    // Cleanup
    return () => {
      pwaService.removeOnlineCallback(handleOnline);
      pwaService.removeOfflineCallback(handleOffline);
      pwaService.removeInstallCallback(handleInstallChange);
    };
  }, []);

  const handleInstall = async () => {
    const installed = await pwaService.promptInstall();
    if (installed) {
      dispatch({ type: "INSTALL_SUCCESS" });
    }
  };

  const handleDismissInstall = () => {
    dispatch({ type: "DISMISS_PROMPT" });
  };

  const handleShare = async () => {
    const shared = await pwaService.shareApp();
    if (!shared) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin);
        alert("App URL copied to clipboard!");
      } catch {
        alert("Share not supported. URL: " + window.location.origin);
      }
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
			<>
				{/* Offline Banner */}
				{!state.isOnline && (
					<div className="fixed top-0 left-0 right-0 bg-orange-600 dark:bg-orange-700 text-white px-4 py-2 text-center text-sm z-[100] animate-in slide-in-from-top duration-300">
						<div className="flex items-center justify-center space-x-2">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
							<span>
								You're offline. The app will continue to work with cached data.
							</span>
						</div>
					</div>
				)}

				{/* Install Prompt */}
				{state.showInstallPrompt && state.canInstall && !state.isInstalled && (
					<div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-xl rounded-2xl p-5 z-40 animate-in slide-in-from-bottom-4 duration-500">
						<div className="flex items-start space-x-4">
							<div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
							</div>
							<div className="flex-1">
								<h3 className="font-semibold text-gray-800 dark:text-neutral-100 text-sm md:text-base">
									Install WebP Converter
								</h3>
								<p className="text-xs md:text-sm text-gray-500 dark:text-neutral-400 mt-1">
									Install this app for faster access and offline functionality.
								</p>
								<div className="flex space-x-2 mt-4">
									<button
										onClick={handleInstall}
										className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors shadow-sm"
									>
										Install
									</button>
									<button
										onClick={handleDismissInstall}
										className="flex-1 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-600 dark:text-neutral-400 text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors"
									>
										Not now
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* PWA Status Indicator */}
				<div className="fixed top-4 left-4 z-[60]">
					<div className="flex items-center gap-2">
						{/* Online Status */}
						<div
							className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight shadow-sm border ${
								state.isOnline
									? "bg-white dark:bg-neutral-800 text-green-600 dark:text-green-400 border-green-50 dark:border-green-900/30"
									: "bg-white dark:bg-neutral-800 text-orange-600 dark:text-orange-400 border-orange-50 dark:border-orange-900/30"
							}`}
						>
							<div
								className={`w-1.5 h-1.5 rounded-full ${
									state.isOnline
										? "bg-green-500 animate-pulse"
										: "bg-orange-500"
								}`}
							></div>
							<span>{state.isOnline ? "Online" : "Offline"}</span>
						</div>

						{/* Install Status */}
						{state.isInstalled && (
							<div className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 border border-blue-50 dark:border-blue-900/30 shadow-sm">
								<svg
									className="w-2.5 h-2.5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
								<span>App</span>
							</div>
						)}

						{/* Storage Info */}
						{state.storageInfo && state.storageInfo.quota > 0 && (
							<div className="bg-white dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 border border-gray-50 dark:border-neutral-700 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight shadow-sm hidden xs:block">
								<span>
									{formatBytes(state.storageInfo.used)} /{" "}
									{formatBytes(state.storageInfo.quota)}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Share Button (when installed) */}
				{state.isInstalled && (
					<div className="fixed top-4 right-4 z-[60]">
						<button
							onClick={handleShare}
							className="bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 text-black dark:text-neutral-200 p-2.5 rounded-full shadow-lg transition-all active:scale-95"
							title="Share"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
								/>
							</svg>
						</button>
					</div>
				)}
			</>
		);
};

export default PWAStatus;

/**
 * PWA Service for handling service worker registration and PWA features
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private isOnline = navigator.onLine;
  private onlineCallbacks: (() => void)[] = [];
  private offlineCallbacks: (() => void)[] = [];
  private installCallbacks: ((canInstall: boolean) => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // Register service worker
    this.registerServiceWorker();
    
    // Listen for install prompt
    this.setupInstallPrompt();
    
    // Listen for online/offline events
    this.setupNetworkListeners();
    
    // Check if already installed
    this.checkInstallStatus();
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                this.showUpdateNotification();
              }
            });
          }
        });
        
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyInstallCallbacks(true);
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifyInstallCallbacks(false);
      console.log('PWA was installed');
    });
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onlineCallbacks.forEach(callback => callback());
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.offlineCallbacks.forEach(callback => callback());
    });
  }

  private checkInstallStatus() {
    // Check if running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }
    
    // Check if running in PWA mode on iOS
    if ((window.navigator as any).standalone === true) {
      this.isInstalled = true;
    }
  }

  private showUpdateNotification() {
    // You can implement a custom notification here
    if (confirm('A new version is available. Reload to update?')) {
      window.location.reload();
    }
  }

  private notifyInstallCallbacks(canInstall: boolean) {
    this.installCallbacks.forEach(callback => callback(canInstall));
  }

  // Public methods
  
  /**
   * Prompt user to install the PWA
   */
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      return outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }

  /**
   * Check if the app can be installed
   */
  canInstall(): boolean {
    return !!this.deferredPrompt && !this.isInstalled;
  }

  /**
   * Check if the app is installed
   */
  getIsInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * Check if the app is online
   */
  getIsOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Add callback for when app goes online
   */
  onOnline(callback: () => void) {
    this.onlineCallbacks.push(callback);
  }

  /**
   * Add callback for when app goes offline
   */
  onOffline(callback: () => void) {
    this.offlineCallbacks.push(callback);
  }

  /**
   * Add callback for install status changes
   */
  onInstallStatusChange(callback: (canInstall: boolean) => void) {
    this.installCallbacks.push(callback);
  }

  /**
   * Remove callbacks
   */
  removeOnlineCallback(callback: () => void) {
    const index = this.onlineCallbacks.indexOf(callback);
    if (index > -1) {
      this.onlineCallbacks.splice(index, 1);
    }
  }

  removeOfflineCallback(callback: () => void) {
    const index = this.offlineCallbacks.indexOf(callback);
    if (index > -1) {
      this.offlineCallbacks.splice(index, 1);
    }
  }

  removeInstallCallback(callback: (canInstall: boolean) => void) {
    const index = this.installCallbacks.indexOf(callback);
    if (index > -1) {
      this.installCallbacks.splice(index, 1);
    }
  }

  /**
   * Get app info for sharing
   */
  getAppInfo() {
    return {
      name: 'Image to WebP Converter',
      description: 'Convert PNG, AVIF, JPEG, and GIF images to WebP format',
      url: window.location.origin,
      isInstalled: this.isInstalled,
      isOnline: this.isOnline,
      canInstall: this.canInstall()
    };
  }

  /**
   * Share app (if Web Share API is available)
   */
  async shareApp() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Image to WebP Converter',
          text: 'Convert your images to WebP format with this amazing tool!',
          url: window.location.origin
        });
        return true;
      } catch (error) {
        console.error('Share failed:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Request persistent storage
   */
  async requestPersistentStorage(): Promise<boolean> {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const granted = await navigator.storage.persist();
        console.log('Persistent storage:', granted ? 'granted' : 'denied');
        return granted;
      } catch (error) {
        console.error('Persistent storage request failed:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Get storage usage
   */
  async getStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0,
          usedPercentage: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0
        };
      } catch (error) {
        console.error('Storage estimate failed:', error);
        return null;
      }
    }
    return null;
  }
}

// Create singleton instance
export const pwaService = new PWAService();
export default pwaService;
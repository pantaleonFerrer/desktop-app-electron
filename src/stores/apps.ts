import { defineStore } from 'pinia';
import { SystemService } from '../services/SystemService';

export interface App {
  DisplayName: string;
  Publisher: string;
  DisplayVersion: string;
  InstallDate: string;
}

interface AppsState {
  apps: App[];
  loading: boolean;
  error: string | null;
}

export const useAppsStore = defineStore('apps', {
  state: (): AppsState => ({
    apps: [],
    loading: false,
    error: null,
  }),

  getters: {
    appsCount: (state) => state.apps.length,
    hasApps: (state) => state.apps.length > 0,
  },

  actions: {
    async fetchApps() {
      this.loading = true;
      this.error = null;

      try {
        await this.waitForElectronAPI();
        const systemService = new SystemService();
        this.apps = await systemService.getInstalledApps();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load apps';
      } finally {
        this.loading = false;
      }
    },

    async waitForElectronAPI(maxAttempts = 50): Promise<void> {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const checkAPI = () => {
          if (typeof window !== 'undefined' && window.electronAPI) {
            resolve();
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkAPI, 100);
          } else {
            reject(new Error('Electron API not available after waiting'));
          }
        };
        checkAPI();
      });
    },
  },
});

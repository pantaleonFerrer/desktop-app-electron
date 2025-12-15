import { defineStore } from 'pinia';
import { SystemService } from '../services/SystemService';

export interface User {
  Name: string;
  Enabled: boolean;
  Description: string;
  LastLogon: string;
}

interface UsersState {
  users: User[];
  currentUser: string;
  loading: boolean;
  error: string | null;
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    currentUser: '',
    loading: false,
    error: null,
  }),

  getters: {
    usersCount: (state) => state.users.length,
    hasUsers: (state) => state.users.length > 0,
    isCurrentUser: (state) => (userName: string) => {
      return userName === state.currentUser;
    },
  },

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        await this.waitForElectronAPI();
        const systemService = new SystemService();
        this.users = await systemService.getSystemUsers();
        this.currentUser = await systemService.getCurrentUser();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load users';
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

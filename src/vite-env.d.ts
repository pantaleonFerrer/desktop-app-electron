/// <reference types="vite/client" />

import { App } from './stores/apps';
import { User } from './stores/users';

interface ElectronAPI {
  getInstalledApps: () => Promise<App[]>;
  getSystemUsers: () => Promise<{ users: User[]; currentUser: string }>;
  closeApp: () => Promise<void>;
}

interface Window {
  electronAPI: ElectronAPI;
}

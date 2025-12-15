/// <reference types="vite/client" />

import { App } from './stores/apps';
import { User } from './stores/users';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<Record<string, any>, Record<string, any>, any>;
  export default component;
}

interface ElectronAPI {
  getInstalledApps: () => Promise<App[]>;
  getSystemUsers: () => Promise<{ users: User[]; currentUser: string }>;
  closeApp: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

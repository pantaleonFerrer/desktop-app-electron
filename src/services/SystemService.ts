import { App } from '../stores/apps';
import { User } from '../stores/users';

export class SystemService {
  private checkElectronAPI(): void {
    if (typeof window === 'undefined') {
      throw new Error('Window is not defined');
    }
    if (!window.electronAPI) {
      throw new Error('Electron API not available. Make sure you are running in Electron.');
    }
  }

  async getInstalledApps(): Promise<App[]> {
    this.checkElectronAPI();
    return await window.electronAPI.getInstalledApps();
  }

  async getSystemUsers(): Promise<User[]> {
    this.checkElectronAPI();
    const result = await window.electronAPI.getSystemUsers();
    return result.users;
  }

  async getCurrentUser(): Promise<string> {
    this.checkElectronAPI();
    const result = await window.electronAPI.getSystemUsers();
    return result.currentUser;
  }
}

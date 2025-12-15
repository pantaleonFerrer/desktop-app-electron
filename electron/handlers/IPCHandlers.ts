import { app, ipcMain } from 'electron';
import { SystemService } from '../services/SystemService';

export class IPCHandlers {
  private systemService: SystemService;

  constructor(systemService: SystemService) {
    this.systemService = systemService;
  }

  register(): void {
    ipcMain.handle('get-installed-apps', async () => {
      try {
        return await this.systemService.getInstalledApps();
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to get installed apps');
      }
    });

    ipcMain.handle('get-system-users', async () => {
      try {
        const users = await this.systemService.getSystemUsers();
        const currentUser = await this.systemService.getCurrentUser();
        return { users, currentUser };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to get system users');
      }
    });

    ipcMain.handle('close-app', async () => {
      app.quit();
    });
  }
}

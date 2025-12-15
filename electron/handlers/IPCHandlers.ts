import { app, ipcMain } from 'electron';
import { SystemService } from '../services/SystemService';

export class IPCHandlers {
  private systemService: SystemService;

  constructor(systemService: SystemService) {
    this.systemService = systemService;
  }

  register(): void {
    ipcMain.handle('get-installed-apps', async () => {
      return await this.systemService.getInstalledApps();
    });

    ipcMain.handle('get-system-users', async () => {
      const users = await this.systemService.getSystemUsers();
      const currentUser = await this.systemService.getCurrentUser();
      return { users, currentUser };
    });

    ipcMain.handle('close-app', async () => {
      app.quit();
    });
  }
}

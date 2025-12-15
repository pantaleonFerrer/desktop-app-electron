import { IApp, IPlatformService, IUser } from '../interfaces/IPlatformService';
import { PlatformServiceFactory } from './platform/PlatformServiceFactory';

export class SystemService {
  private platformService: IPlatformService;

  constructor(platformService?: IPlatformService) {
    this.platformService = platformService || PlatformServiceFactory.create();
  }

  async getInstalledApps(): Promise<IApp[]> {
    return this.platformService.getInstalledApps();
  }

  async getSystemUsers(): Promise<IUser[]> {
    return this.platformService.getSystemUsers();
  }

  async getCurrentUser(): Promise<string> {
    return this.platformService.getCurrentUser();
  }

  async setAutoStart(enabled: boolean): Promise<void> {
    return this.platformService.setAutoStart(enabled);
  }
}

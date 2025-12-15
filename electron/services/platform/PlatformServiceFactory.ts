import { IPlatformService } from '../../interfaces/IPlatformService';
import { MacOSPlatformService } from './MacOSPlatformService';
import { WindowsPlatformService } from './WindowsPlatformService';

export class PlatformServiceFactory {
  static create(): IPlatformService {
    const platform = process.platform;

    if (platform === 'win32') {
      return new WindowsPlatformService();
    } else if (platform === 'darwin') {
      return new MacOSPlatformService();
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}

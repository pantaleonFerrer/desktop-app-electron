import { nativeImage, Tray } from 'electron';
import { WindowManager } from '../windows/WindowManager';

export class TrayManager {
  private tray: Tray | null = null;
  private windowManager: WindowManager;

  constructor(windowManager: WindowManager) {
    this.windowManager = windowManager;
  }

  create(): Tray {
    const icon = nativeImage.createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    );
    this.tray = new Tray(icon);
    this.tray.setToolTip('Desktop App');

    this.tray.on('click', () => {
      this.windowManager.toggle();
    });

    return this.tray;
  }

  getTray(): Tray | null {
    return this.tray;
  }
}

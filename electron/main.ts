import { app } from 'electron';
import { IPCHandlers } from './handlers/IPCHandlers';
import { SystemService } from './services/SystemService';
import { TrayManager } from './tray/TrayManager';
import { WindowManager } from './windows/WindowManager';

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

const systemService = new SystemService();
const ipcHandlers = new IPCHandlers(systemService);
const windowManager = new WindowManager(isDev);
const trayManager = new TrayManager(windowManager);

app.whenReady().then(async () => {
  ipcHandlers.register();
  const window = windowManager.create();
  trayManager.create();

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    window.show();
  }

  try {
    await systemService.setAutoStart(true);
  } catch (_error) {}
});

app.on('window-all-closed', () => {});

app.on('activate', () => {
  windowManager.show();
});

app.on('before-quit', () => {});

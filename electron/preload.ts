import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getInstalledApps: () => ipcRenderer.invoke('get-installed-apps'),
  getSystemUsers: () => ipcRenderer.invoke('get-system-users'),
  closeApp: () => ipcRenderer.invoke('close-app'),
});

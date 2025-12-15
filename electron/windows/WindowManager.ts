import * as fs from 'node:fs';
import * as path from 'node:path';
import { BrowserWindow } from 'electron';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private isDev: boolean;

  constructor(isDev: boolean) {
    this.isDev = isDev;
  }

  private getPreloadPath(): string {
    const preloadPath = path.join(__dirname, '..', 'preload.js');
    const absolutePath = path.resolve(preloadPath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Preload file not found at: ${absolutePath}`);
    }

    return absolutePath;
  }

  create(): BrowserWindow {
    const preloadPath = this.getPreloadPath();

    this.mainWindow = new BrowserWindow({
      width: 600,
      height: 500,
      frame: false,
      transparent: false,
      resizable: true,
      show: this.isDev,
      skipTaskbar: true,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true,
      },
    });

    if (this.isDev) {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
      this.mainWindow.webContents.once('did-finish-load', () => {
        if (this.mainWindow) {
          this.mainWindow.show();
          this.mainWindow.focus();
        }
      });
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
      this.mainWindow.webContents.once('did-finish-load', () => {
        if (this.mainWindow) {
          this.mainWindow.show();
        }
      });
    }

    this.setupEventHandlers();

    return this.mainWindow;
  }

  private setupEventHandlers(): void {
    if (!this.mainWindow) return;

    this.mainWindow.on('blur', () => {
      if (this.mainWindow) {
        this.mainWindow.hide();
      }
    });

    this.mainWindow.on('close', (event) => {
      event.preventDefault();
      this.hide();
    });
  }

  show(): void {
    if (this.mainWindow) {
      this.mainWindow.show();
      this.mainWindow.focus();
    }
  }

  hide(): void {
    if (this.mainWindow) {
      this.mainWindow.hide();
    }
  }

  toggle(): void {
    if (this.mainWindow) {
      if (this.mainWindow.isVisible()) {
        this.hide();
      } else {
        this.show();
      }
    }
  }

  getWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}

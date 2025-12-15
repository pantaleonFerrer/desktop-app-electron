import * as fs from 'node:fs';
import * as path from 'node:path';
import { app, BrowserWindow } from 'electron';

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
      show: false,
      skipTaskbar: false,
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
      const appPath = app.getAppPath();
      const htmlPath = path.join(appPath, 'dist', 'index.html');

      if (!fs.existsSync(htmlPath)) {
        const fallbackPath = path.join(__dirname, '../dist/index.html');
        if (fs.existsSync(fallbackPath)) {
          this.mainWindow.loadFile(fallbackPath);
        } else {
          throw new Error(`HTML file not found. Tried: ${htmlPath} and ${fallbackPath}`);
        }
      } else {
        this.mainWindow.loadFile(htmlPath);
      }

      this.mainWindow.webContents.once('did-finish-load', () => {
        if (this.mainWindow) {
          this.mainWindow.show();
          this.mainWindow.focus();
        }
      });

      this.mainWindow.webContents.once(
        'did-fail-load',
        (_event, errorCode, errorDescription, validatedURL) => {
          throw new Error(`Failed to load ${validatedURL}: ${errorCode} - ${errorDescription}`);
        }
      );
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

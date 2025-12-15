import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { app } from 'electron';
import { IApp, IPlatformService, IUser } from '../../interfaces/IPlatformService';

const execAsync = promisify(exec);

export class WindowsPlatformService implements IPlatformService {
  async getInstalledApps(): Promise<IApp[]> {
    try {
      const script = `$paths = @('HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*', 'HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*', 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'); $apps = @(); foreach ($path in $paths) { try { $items = Get-ItemProperty $path -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -and $_.DisplayName -notlike '*Update*' -and $_.DisplayName -notlike '*Hotfix*' -and $_.DisplayName -notlike '*Security Update*' -and $_.DisplayName -notlike '*KB*' }; if ($items) { $apps += $items } } catch {} }; $apps | Select-Object DisplayName, Publisher, InstallDate, DisplayVersion -Unique | ConvertTo-Json -Compress`;
      const { stdout, stderr } = await execAsync(
        `powershell -NoProfile -ExecutionPolicy Bypass -Command "${script}"`,
        {
          maxBuffer: 10 * 1024 * 1024,
        }
      );

      if (stderr?.trim()) {
        throw new Error(`PowerShell error: ${stderr}`);
      }

      const trimmedOutput = stdout.trim();
      if (!trimmedOutput) {
        return [];
      }

      const apps = JSON.parse(trimmedOutput);
      const appArray = Array.isArray(apps) ? apps : apps ? [apps] : [];

      const uniqueApps = new Map<string, any>();
      for (const app of appArray) {
        if (app?.DisplayName) {
          const key = app.DisplayName.toLowerCase();
          if (!uniqueApps.has(key)) {
            uniqueApps.set(key, app);
          }
        }
      }

      return Array.from(uniqueApps.values()).map((app: any) => ({
        DisplayName: app.DisplayName || 'Unknown',
        Publisher: app.Publisher || 'Unknown',
        DisplayVersion: app.DisplayVersion || 'Unknown',
        InstallDate: app.InstallDate || '',
      }));
    } catch (error) {
      throw new Error(
        `Failed to get installed apps: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getSystemUsers(): Promise<IUser[]> {
    try {
      const script = `Get-LocalUser | Select-Object Name, Enabled, Description, LastLogon | ConvertTo-Json -Compress`;
      const { stdout, stderr } = await execAsync(
        `powershell -NoProfile -ExecutionPolicy Bypass -Command "${script}"`,
        {
          maxBuffer: 10 * 1024 * 1024,
        }
      );

      if (stderr?.trim()) {
        throw new Error(`PowerShell error: ${stderr}`);
      }

      const trimmedOutput = stdout.trim();
      if (!trimmedOutput) {
        return [];
      }

      const users = JSON.parse(trimmedOutput);
      const userArray = Array.isArray(users) ? users : users ? [users] : [];

      return userArray.map((user: any) => {
        let lastLogon = 'Never';
        if (user.LastLogon && user.LastLogon !== null) {
          try {
            const date = new Date(user.LastLogon);
            if (!isNaN(date.getTime())) {
              lastLogon = date.toISOString();
            }
          } catch {
            // Invalid date, keep as 'Never'
          }
        }
        return {
          Name: user.Name || 'Unknown',
          Enabled: user.Enabled !== false,
          Description: user.Description || '',
          LastLogon: lastLogon,
        };
      });
    } catch (error) {
      throw new Error(
        `Failed to get system users: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getCurrentUser(): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(
        'powershell -NoProfile -ExecutionPolicy Bypass -Command "$env:USERNAME"'
      );
      if (stderr?.trim()) {
        throw new Error(`PowerShell error: ${stderr}`);
      }
      return stdout.trim();
    } catch (error) {
      throw new Error(
        `Failed to get current user: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async setAutoStart(enabled: boolean): Promise<void> {
    const appPath = app.getPath('exe');
    const appName = app.getName();

    if (enabled) {
      const script = `
        $regPath = "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
        Set-ItemProperty -Path $regPath -Name "${appName}" -Value "${appPath}"
      `;
      return new Promise((resolve, reject) => {
        exec(`powershell -Command "${script}"`, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    } else {
      const script = `
        $regPath = "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
        Remove-ItemProperty -Path $regPath -Name "${appName}" -ErrorAction SilentlyContinue
      `;
      return new Promise((resolve, reject) => {
        exec(`powershell -Command "${script}"`, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  }
}

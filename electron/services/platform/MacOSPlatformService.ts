import { exec } from 'node:child_process';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { IApp, IPlatformService, IUser } from '../../interfaces/IPlatformService';

const execAsync = promisify(exec);

export class MacOSPlatformService implements IPlatformService {
  async getInstalledApps(): Promise<IApp[]> {
    try {
      const apps: IApp[] = [];
      const appPaths: string[] = [];

      try {
        const { stdout: userApps } = await execAsync(
          `find /Applications -maxdepth 1 -name "*.app" -type d 2>/dev/null || true`
        );
        const userAppList = userApps.trim().split('\n').filter(Boolean);
        appPaths.push(...userAppList);
      } catch (_err) {}

      try {
        const { stdout: systemApps } = await execAsync(
          `find /System/Applications -maxdepth 1 -name "*.app" -type d 2>/dev/null || true`
        );
        const systemAppList = systemApps.trim().split('\n').filter(Boolean);
        appPaths.push(...systemAppList);
      } catch (_err) {}

      for (const appPath of appPaths) {
        try {
          const appName = path.basename(appPath, '.app');

          let version = 'Unknown';
          let publisher = 'Unknown';
          let installDate = '';

          try {
            const { stdout: info } = await execAsync(
              `mdls -name kMDItemVersion -name kMDItemCopyright "${appPath}" 2>/dev/null`
            );
            const versionMatch = info.match(/kMDItemVersion\s*=\s*"([^"]+)"/);
            const publisherMatch = info.match(/kMDItemCopyright\s*=\s*"([^"]+)"/);

            if (versionMatch) {
              version = versionMatch[1];
            }
            if (publisherMatch) {
              publisher = publisherMatch[1];
            }
          } catch (_err) {}

          try {
            const { stdout: dateInfo } = await execAsync(
              `stat -f "%Sm" -t "%Y%m%d" "${appPath}" 2>/dev/null`
            );
            installDate = dateInfo.trim();
          } catch (_err) {}

          apps.push({
            DisplayName: appName,
            Publisher: publisher,
            DisplayVersion: version,
            InstallDate: installDate,
          });
        } catch (_err) {}
      }

      const uniqueApps = apps
        .filter(
          (app, index, self) => index === self.findIndex((a) => a.DisplayName === app.DisplayName)
        )
        .sort((a, b) => {
          const nameA = a.DisplayName.toLowerCase();
          const nameB = b.DisplayName.toLowerCase();
          return nameA.localeCompare(nameB);
        });

      return uniqueApps;
    } catch (_error) {
      return [];
    }
  }

  async getSystemUsers(): Promise<IUser[]> {
    try {
      const { stdout } = await execAsync(
        `dscl . list /Users | grep -v '^_' | grep -v '^daemon' | grep -v '^nobody' | grep -v '^root'`
      );
      const userNames = stdout.trim().split('\n').filter(Boolean);

      const users: IUser[] = [];

      for (const userName of userNames) {
        try {
          const { stdout: realName } = await execAsync(
            `dscl . -read /Users/${userName} RealName 2>/dev/null | sed 's/RealName: //' || echo ""`
          );
          const { stdout: shell } = await execAsync(
            `dscl . -read /Users/${userName} UserShell 2>/dev/null | sed 's/UserShell: //' || echo ""`
          );

          const enabled = shell.trim() !== '/usr/bin/false' && shell.trim() !== '';

          let lastLogon = '';
          try {
            const { stdout: lastLoginInfo } = await execAsync(
              `last -1 ${userName} 2>/dev/null | head -1 || echo ""`
            );
            if (lastLoginInfo.trim()) {
              lastLogon = lastLoginInfo.trim();
            }
          } catch {}

          users.push({
            Name: userName,
            Enabled: enabled,
            Description: realName.trim() || userName,
            LastLogon: lastLogon || 'Never',
          });
        } catch (_err) {}
      }

      return users.sort((a, b) => {
        const nameA = a.Name.toLowerCase();
        const nameB = b.Name.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } catch (_error) {
      return [];
    }
  }

  async getCurrentUser(): Promise<string> {
    return process.env.USER || process.env.USERNAME || '';
  }

  async setAutoStart(_enabled: boolean): Promise<void> {}
}

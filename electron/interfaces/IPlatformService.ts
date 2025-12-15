export interface IApp {
  DisplayName: string;
  Publisher: string;
  DisplayVersion: string;
  InstallDate: string;
}

export interface IUser {
  Name: string;
  Enabled: boolean;
  Description: string;
  LastLogon: string;
}

export interface IPlatformService {
  getInstalledApps(): Promise<IApp[]>;
  getSystemUsers(): Promise<IUser[]>;
  getCurrentUser(): Promise<string>;
  setAutoStart(enabled: boolean): Promise<void>;
}

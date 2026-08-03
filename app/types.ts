export type SoftwareItem = {
  id: number;
  name: string;
  description: string;
  version: string;
  platform: string;
  officialUrl: string;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
};

export type WindowName = "software" | "about" | "admin";

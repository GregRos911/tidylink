
export interface LinkItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
  isQrCodeGenerated?: boolean;
  title?: string | null;
}

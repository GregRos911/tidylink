
export interface UsageStatsProps {
  usageStats: {
    links: { used: number; total: number };
    qrCodes: { used: number; total: number };
    customBackHalves: { used: number; total: number };
  };
}

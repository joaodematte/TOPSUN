export const DEFAULT_STATUS_THRESHOLDS = {
  attention: 14,
  critical: 15,
  onTime: 7,
} as const;

export interface StatusThresholds {
  attention: number;
  critical: number;
  onTime: number;
}

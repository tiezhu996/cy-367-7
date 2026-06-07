export const STATUS_LABELS: Record<string, string> = {
  pending: "待签到",
  reserved: "已预约",
  checked_in: "已签到",
  checked_out: "已签退",
  no_show: "爽约",
  cancelled: "已取消",
  waiting: "等待签到",
  ready: "可签到",
  late: "已迟到",
};

export const STATUS_TONES: Record<string, string> = {
  pending: "neutral",
  reserved: "cool",
  checked_in: "primary",
  checked_out: "neutral",
  no_show: "warm",
  cancelled: "neutral",
  waiting: "neutral",
  ready: "primary",
  late: "warm",
};

export const SEAT_STATUS_LABELS: Record<string, string> = {
  available: "空闲",
  reserved: "已预约",
  occupied: "使用中",
  unavailable: "不可用",
};

export function formatTime(timeStr: string): string {
  return timeStr.substring(0, 5);
}

export function formatDateTime(isoStr: string | null): string {
  if (!isoStr) return "-";
  const date = new Date(isoStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function formatDuration(minutes: number): string {
  if (minutes === 0) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins > 0 ? mins + "分钟" : ""}`;
  }
  return `${mins}分钟`;
}

export function getMinutesUntil(startTime: string, reservationDate: string): number {
  const now = new Date();
  const startDateTime = new Date(`${reservationDate}T${startTime}`);
  return Math.max(0, Math.ceil((startDateTime.getTime() - now.getTime()) / 60000));
}

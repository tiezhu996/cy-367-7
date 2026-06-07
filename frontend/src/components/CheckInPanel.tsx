import { useState, useEffect } from "react";
import type { Reservation, AttendanceRecord, CheckInStatus } from "../types";
import {
  STATUS_LABELS,
  formatTime,
  formatDateTime,
} from "../utils/attendance";
import { getCheckInStatus, doCheckIn, doCheckOut } from "../api/client";

interface CheckInPanelProps {
  pendingReservations: Reservation[];
  activeSessions: AttendanceRecord[];
  currentUserId?: number;
  onActionComplete?: () => void;
}

interface StatusInfo {
  status: CheckInStatus | null;
  loading: boolean;
}

const statusColorMap: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reserved: "bg-blue-100 text-blue-800",
  checked_in: "bg-green-100 text-green-800",
  waiting: "bg-gray-100 text-gray-800",
  ready: "bg-green-100 text-green-800",
  late: "bg-red-100 text-red-800",
};

export function CheckInPanel({
  pendingReservations,
  activeSessions,
  currentUserId = 1,
  onActionComplete,
}: CheckInPanelProps) {
  const [statusMap, setStatusMap] = useState<Record<number, StatusInfo>>({});
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    pendingReservations.forEach((r) => {
      if (!statusMap[r.id]) {
        fetchStatus(r.id);
      }
    });
  }, [pendingReservations]);

  const fetchStatus = async (reservationId: number) => {
    setStatusMap((prev) => ({
      ...prev,
      [reservationId]: { status: null, loading: true },
    }));
    try {
      const status = await getCheckInStatus(reservationId);
      setStatusMap((prev) => ({
        ...prev,
        [reservationId]: { status, loading: false },
      }));
    } catch {
      const statusInfo = statusMap[reservationId]?.status;
      if (!statusInfo) {
        const reservation = pendingReservations.find((r) => r.id === reservationId);
        if (reservation) {
          const now = new Date();
          const startDateTime = new Date(
            `${reservation.reservationDate}T${reservation.startTime}`
          );
          const earliest = new Date(startDateTime.getTime() - 15 * 60000);
          const latest = new Date(startDateTime.getTime() + 10 * 60000);

          let status: string = "waiting";
          let canCheckIn = false;
          let canCheckOut = false;
          let message = "等待签到";
          let minutesUntilCheckIn: number | undefined;

          if (now < earliest) {
            minutesUntilCheckIn = Math.ceil(
              (earliest.getTime() - now.getTime()) / 60000
            );
            message = `签到尚未开放，请在开场前15分钟内签到（还需等待${minutesUntilCheckIn}分钟）`;
          } else if (now > latest) {
            status = "late";
            message = "已过签到时间";
          } else {
            status = "ready";
            canCheckIn = true;
            message = "可以签到";
          }

          setStatusMap((prev) => ({
            ...prev,
            [reservationId]: {
              status: {
                canCheckIn,
                canCheckOut,
                status,
                message,
                minutesUntilCheckIn,
              },
              loading: false,
            },
          }));
        }
      }
    }
  };

  const handleCheckIn = async (reservationId: number) => {
    setActionLoading((prev) => ({ ...prev, [reservationId]: true }));
    try {
      const result = await doCheckIn(reservationId);
      setToast({ message: result.message, type: result.success ? "success" : "error" });
      if (result.success) {
        fetchStatus(reservationId);
        onActionComplete?.();
      }
    } catch {
      setToast({ message: "签到失败，请重试", type: "error" });
    } finally {
      setActionLoading((prev) => ({ ...prev, [reservationId]: false }));
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleCheckOut = async (reservationId: number) => {
    setActionLoading((prev) => ({ ...prev, [reservationId]: true }));
    try {
      const result = await doCheckOut(reservationId);
      setToast({ message: result.message, type: result.success ? "success" : "error" });
      if (result.success) {
        fetchStatus(reservationId);
        onActionComplete?.();
      }
    } catch {
      setToast({ message: "签退失败，请重试", type: "error" });
    } finally {
      setActionLoading((prev) => ({ ...prev, [reservationId]: false }));
    }
    setTimeout(() => setToast(null), 3000);
  };

  const getCurrentElapsed = (checkInTime: string | null): string => {
    if (!checkInTime) return "-";
    const elapsed = Math.floor(
      (currentTime.getTime() - new Date(checkInTime).getTime()) / 60000
    );
    const hours = Math.floor(elapsed / 60);
    const mins = elapsed % 60;
    return `${hours > 0 ? hours + "小时" : ""}${mins}分钟`;
  };

  return (
    <div className="work-panel">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black">签到签退</h2>
        <span className="pill">
          当前时间：{currentTime.toLocaleTimeString("zh-CN", { hour12: false })}
        </span>
      </div>

      {toast && (
        <div
          className={`mb-4 rounded-lg p-3 ${toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {toast.message}
        </div>
      )}

      {activeSessions.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-bold">进行中</h3>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-ink/10 bg-white/50 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-accent">{session.seatCode}</span>
                    <span className="text-sm text-ink/60">{session.zone || session.username}</span>
                    <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      学习中
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-ink/70">
                    签到时间：{formatDateTime(session.checkInTime)}
                  </div>
                  <div className="mt-1 text-sm font-medium text-accent">
                    已学习：{getCurrentElapsed(session.checkInTime)}
                  </div>
                </div>
                <button
                  onClick={() => handleCheckOut(session.reservationId)}
                  disabled={actionLoading[session.reservationId]}
                  className="rounded-md bg-accent px-5 py-2 font-bold text-white transition hover:bg-accent/90 disabled:opacity-50"
                >
                  {actionLoading[session.reservationId] ? "处理中..." : "签退"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingReservations.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-bold">待签到预约</h3>
          <div className="space-y-3">
            {pendingReservations.map((reservation) => {
              const statusInfo = statusMap[reservation.id];
              const status = statusInfo?.status;
              const loading = statusInfo?.loading ?? false;

              return (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between rounded-lg border border-ink/10 bg-white/50 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-accent">
                        {reservation.seatCode}
                      </span>
                      <span className="text-sm text-ink/60">{reservation.zone}</span>
                      {status && (
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColorMap[status.status] || "bg-ink/10 text-ink"}`}
                        >
                          {STATUS_LABELS[status.status] || status.status}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-ink/70">
                      {reservation.reservationDate} · {formatTime(reservation.startTime)} -{" "}
                      {formatTime(reservation.endTime)}
                    </div>
                    {status && (
                      <div
                        className={`mt-1 text-sm ${status.status === "late" || status.status === "no_show" ? "text-red-600" : status.status === "ready" ? "text-green-600" : "text-ink/60"}`}
                      >
                        {status.message}
                        {status.minutesUntilCheckIn && status.minutesUntilCheckIn > 0 && (
                          <span className="ml-1 font-medium">
                            ({status.minutesUntilCheckIn}分钟后开放)
                          </span>
                        )}
                      </div>
                    )}
                    {loading && (
                      <div className="mt-1 text-sm text-ink/50">加载状态中...</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleCheckIn(reservation.id)}
                    disabled={
                      !status?.canCheckIn ||
                      actionLoading[reservation.id] ||
                      loading
                    }
                    className="rounded-md bg-accent px-5 py-2 font-bold text-white transition hover:bg-accent/90 disabled:bg-ink/20 disabled:text-ink/40"
                  >
                    {actionLoading[reservation.id]
                      ? "签到中..."
                      : status?.canCheckIn
                        ? "签到"
                        : "签到"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pendingReservations.length === 0 && activeSessions.length === 0 && (
        <div className="py-8 text-center text-ink/60">
          暂无待签到预约和进行中的会话
        </div>
      )}
    </div>
  );
}

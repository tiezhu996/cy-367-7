import type { AttendanceRecord } from "../types";
import {
  STATUS_LABELS,
  formatTime,
  formatDateTime,
  formatDuration,
} from "../utils/attendance";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  title?: string;
}

const statusColorMap: Record<string, string> = {
  pending: "bg-ink/10 text-ink",
  checked_in: "bg-green-100 text-green-800",
  checked_out: "bg-blue-100 text-blue-800",
  no_show: "bg-red-100 text-red-800",
};

export function AttendanceTable({
  records,
  title = "签到记录",
}: AttendanceTableProps) {
  return (
    <div className="work-panel">
      <h2 className="mb-5 text-2xl font-black">{title}</h2>
      <div className="overflow-hidden rounded-lg border border-ink/10">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-ink/5">
            <tr>
              <th className="p-3">座位</th>
              <th className="p-3">用户</th>
              <th className="p-3">预约时段</th>
              <th className="p-3">签到时间</th>
              <th className="p-3">签退时间</th>
              <th className="p-3">学习时长</th>
              <th className="p-3">状态</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr className="border-t border-ink/10">
                <td colSpan={7} className="p-6 text-center text-ink/60">
                  暂无签到记录
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr className="border-t border-ink/10" key={record.id}>
                  <td className="p-3 font-medium">{record.seatCode}</td>
                  <td className="p-3">{record.username}</td>
                  <td className="p-3">
                    <div>{record.reservationDate}</div>
                    <div className="text-xs text-ink/60">
                      {formatTime(record.startTime)} - {formatTime(record.endTime)}
                    </div>
                  </td>
                  <td className="p-3">{formatDateTime(record.checkInTime)}</td>
                  <td className="p-3">{formatDateTime(record.checkOutTime)}</td>
                  <td className="p-3 font-medium">
                    {formatDuration(record.durationMinutes)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColorMap[record.status] || "bg-ink/10 text-ink"}`}
                    >
                      {STATUS_LABELS[record.status] || record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

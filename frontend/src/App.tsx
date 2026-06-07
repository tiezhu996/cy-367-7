import { useEffect, useState } from "react";
import { fetchOverview, fetchAttendanceOverview } from "./api/client";
import { APP_CODE, APP_NAME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { createFallbackOverview } from "./state/dashboard";
import { createFallbackAttendance } from "./data/attendance";
import type { OverviewResponse, AttendanceOverview, KpiItem } from "./types";
import { FeatureStrip } from "./components/FeatureStrip";
import { MetricGrid } from "./components/MetricGrid";
import { OperationsTable } from "./components/OperationsTable";
import { CheckInPanel } from "./components/CheckInPanel";
import { AttendanceTable } from "./components/AttendanceTable";
import { UserRestrictionPanel } from "./components/UserRestrictionPanel";
import { formatDuration } from "./utils/attendance";

export default function App() {
  const [overview, setOverview] = useState<OverviewResponse>(createFallbackOverview());
  const [attendance, setAttendance] = useState<AttendanceOverview>(createFallbackAttendance());
  const [notice, setNotice] = useState(REQUEST_MESSAGES.overviewFallback);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = () => {
    fetchOverview()
      .then((payload) => {
        setOverview(payload);
      })
      .catch(() => setNotice(REQUEST_MESSAGES.overviewFallback));

    fetchAttendanceOverview()
      .then((payload) => {
        setAttendance(payload);
        setNotice("后端服务已联通，当前展示实时接口数据。");
      })
      .catch(() => {
        setAttendance(createFallbackAttendance());
      });
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const attendanceKpis: KpiItem[] = [
    {
      label: "今日预约",
      value: String(attendance.todayReservations),
      trend: "待签到",
      tone: "cool",
    },
    {
      label: "已签到",
      value: String(attendance.todayCheckedIn),
      trend: "学习中",
      tone: "primary",
    },
    {
      label: "已签退",
      value: String(attendance.todayCheckedOut),
      trend: "已完成",
      tone: "neutral",
    },
    {
      label: "爽约",
      value: String(attendance.todayNoShow),
      trend: "需关注",
      tone: "warm",
    },
    {
      label: "累计学习时长",
      value: formatDuration(attendance.totalStudyMinutes),
      trend: "今日",
      tone: "primary",
    },
    {
      label: "进行中",
      value: String(attendance.activeSessions.length),
      trend: "座位使用中",
      tone: "primary",
    },
  ];

  const handleActionComplete = () => {
    setTimeout(() => setRefreshKey((k) => k + 1), 500);
  };

  return (
    <main className="app-shell text-ink">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-code">{APP_CODE}</span>
          <h1 className="brand-title">{APP_NAME}</h1>
        </div>
        <a className="rounded-md bg-accent px-4 py-2 font-bold text-white" href={REQUEST_MESSAGES.healthPath}>API Health</a>
      </header>
      <section className="workspace">
        <div className="lead-grid">
          <article className="hero-panel">
            <span className="pill">{notice}</span>
            <h2 className="mt-5 text-3xl font-black">{overview.appName}</h2>
            <p>{overview.description}</p>
          </article>
          <MetricGrid items={overview.kpis} />
        </div>
        <FeatureStrip items={overview.features} />

        <section className="mb-6">
          <h2 className="mb-5 text-2xl font-black">签到签退概览</h2>
          <MetricGrid items={attendanceKpis} />
        </section>

        <CheckInPanel
          pendingReservations={attendance.pendingReservations}
          activeSessions={attendance.activeSessions}
          onActionComplete={handleActionComplete}
        />

        <AttendanceTable records={attendance.recentRecords} title="签到记录" />

        <UserRestrictionPanel users={attendance.users} maxNoShow={3} />

        <section className="work-panel">
          <h2 className="mb-5 text-2xl font-black">运营任务流</h2>
          <OperationsTable records={overview.records} />
        </section>
      </section>
    </main>
  );
}

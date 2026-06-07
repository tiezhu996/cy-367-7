import type { ReservationStatus, AttendanceStatus, SeatStatus } from "./attendance.constants";
import { RESERVATION_STATUS, ATTENDANCE_STATUS, SEAT_STATUS } from "./attendance.constants";

export interface Seat {
  id: number;
  seatCode: string;
  floor: number;
  zone: string;
  status: SeatStatus;
}

export interface User {
  id: number;
  username: string;
  phone: string;
  noShowCount: number;
  isRestricted: boolean;
}

export interface Reservation {
  id: number;
  userId: number;
  seatId: number;
  seatCode: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  checkInTime: string | null;
  checkOutTime: string | null;
  durationMinutes: number;
  username: string;
  zone: string;
}

export interface AttendanceRecord {
  id: number;
  reservationId: number;
  userId: number;
  seatId: number;
  seatCode: string;
  username: string;
  zone: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  durationMinutes: number;
  status: AttendanceStatus;
  reservationDate: string;
  startTime: string;
  endTime: string;
}

export interface NoShowRecord {
  id: number;
  userId: number;
  username: string;
  reservationId: number;
  reason: string;
  createdAt: string;
}

const now = new Date();
const todayStr = now.toISOString().split("T")[0];
const hours = now.getHours();
const nextHour = hours + 1;
const hourAfter = hours + 2;

export const mockSeats: Seat[] = [
  { id: 1, seatCode: "A01", floor: 1, zone: "静音区", status: SEAT_STATUS.AVAILABLE },
  { id: 2, seatCode: "A02", floor: 1, zone: "静音区", status: SEAT_STATUS.RESERVED },
  { id: 3, seatCode: "B01", floor: 1, zone: "讨论区", status: SEAT_STATUS.OCCUPIED },
  { id: 4, seatCode: "B02", floor: 1, zone: "讨论区", status: SEAT_STATUS.AVAILABLE },
  { id: 5, seatCode: "C01", floor: 2, zone: "窗景区", status: SEAT_STATUS.UNAVAILABLE },
  { id: 6, seatCode: "C02", floor: 2, zone: "窗景区", status: SEAT_STATUS.AVAILABLE },
];

export const mockUsers: User[] = [
  { id: 1, username: "张三", phone: "13800138001", noShowCount: 0, isRestricted: false },
  { id: 2, username: "李四", phone: "13800138002", noShowCount: 2, isRestricted: false },
  { id: 3, username: "王五", phone: "13800138003", noShowCount: 4, isRestricted: true },
];

export const mockReservations: Reservation[] = [
  {
    id: 1,
    userId: 1,
    seatId: 2,
    seatCode: "A02",
    reservationDate: todayStr,
    startTime: `${String(nextHour).padStart(2, "0")}:00:00`,
    endTime: `${String(hourAfter).padStart(2, "0")}:00:00`,
    status: RESERVATION_STATUS.RESERVED,
    checkInTime: null,
    checkOutTime: null,
    durationMinutes: 0,
    username: "张三",
    zone: "静音区",
  },
  {
    id: 2,
    userId: 1,
    seatId: 3,
    seatCode: "B01",
    reservationDate: todayStr,
    startTime: `${String(hours).padStart(2, "0")}:00:00`,
    endTime: `${String(nextHour).padStart(2, "0")}:00:00`,
    status: RESERVATION_STATUS.CHECKED_IN,
    checkInTime: new Date(now.getTime() - 20 * 60000).toISOString(),
    checkOutTime: null,
    durationMinutes: 0,
    username: "张三",
    zone: "讨论区",
  },
  {
    id: 3,
    userId: 2,
    seatId: 1,
    seatCode: "A01",
    reservationDate: todayStr,
    startTime: `${String(hours - 2).padStart(2, "0")}:00:00`,
    endTime: `${String(hours - 1).padStart(2, "0")}:00:00`,
    status: RESERVATION_STATUS.CHECKED_OUT,
    checkInTime: new Date(now.getTime() - 180 * 60000).toISOString(),
    checkOutTime: new Date(now.getTime() - 120 * 60000).toISOString(),
    durationMinutes: 60,
    username: "李四",
    zone: "静音区",
  },
  {
    id: 4,
    userId: 2,
    seatId: 4,
    seatCode: "B02",
    reservationDate: todayStr,
    startTime: `${String(hours - 3).padStart(2, "0")}:00:00`,
    endTime: `${String(hours - 2).padStart(2, "0")}:00:00`,
    status: RESERVATION_STATUS.NO_SHOW,
    checkInTime: null,
    checkOutTime: null,
    durationMinutes: 0,
    username: "李四",
    zone: "讨论区",
  },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    reservationId: 2,
    userId: 1,
    seatId: 3,
    seatCode: "B01",
    username: "张三",
    zone: "讨论区",
    checkInTime: new Date(now.getTime() - 20 * 60000).toISOString(),
    checkOutTime: null,
    durationMinutes: 0,
    status: ATTENDANCE_STATUS.CHECKED_IN,
    reservationDate: todayStr,
    startTime: `${String(hours).padStart(2, "0")}:00:00`,
    endTime: `${String(nextHour).padStart(2, "0")}:00:00`,
  },
  {
    id: 2,
    reservationId: 3,
    userId: 2,
    seatId: 1,
    seatCode: "A01",
    username: "李四",
    zone: "静音区",
    checkInTime: new Date(now.getTime() - 180 * 60000).toISOString(),
    checkOutTime: new Date(now.getTime() - 120 * 60000).toISOString(),
    durationMinutes: 60,
    status: ATTENDANCE_STATUS.CHECKED_OUT,
    reservationDate: todayStr,
    startTime: `${String(hours - 2).padStart(2, "0")}:00:00`,
    endTime: `${String(hours - 1).padStart(2, "0")}:00:00`,
  },
  {
    id: 3,
    reservationId: 4,
    userId: 2,
    seatId: 4,
    seatCode: "B02",
    username: "李四",
    zone: "讨论区",
    checkInTime: null,
    checkOutTime: null,
    durationMinutes: 0,
    status: ATTENDANCE_STATUS.NO_SHOW,
    reservationDate: todayStr,
    startTime: `${String(hours - 3).padStart(2, "0")}:00:00`,
    endTime: `${String(hours - 2).padStart(2, "0")}:00:00`,
  },
  {
    id: 4,
    reservationId: 1,
    userId: 1,
    seatId: 2,
    seatCode: "A02",
    username: "张三",
    zone: "静音区",
    checkInTime: null,
    checkOutTime: null,
    durationMinutes: 0,
    status: ATTENDANCE_STATUS.PENDING,
    reservationDate: todayStr,
    startTime: `${String(nextHour).padStart(2, "0")}:00:00`,
    endTime: `${String(hourAfter).padStart(2, "0")}:00:00`,
  },
];

export const mockNoShowRecords: NoShowRecord[] = [
  {
    id: 1,
    userId: 2,
    username: "李四",
    reservationId: 4,
    reason: "预约未签到，开场后超时",
    createdAt: new Date(now.getTime() - 90 * 60000).toISOString(),
  },
];

export interface AttendanceOverview {
  todayReservations: number;
  todayCheckedIn: number;
  todayCheckedOut: number;
  todayNoShow: number;
  totalStudyMinutes: number;
  pendingReservations: Reservation[];
  activeSessions: AttendanceRecord[];
  recentRecords: AttendanceRecord[];
  users: User[];
  seats: Seat[];
}

export function getAttendanceOverview(): AttendanceOverview {
  const todayReservations = mockReservations.filter(
    (r) => r.reservationDate === todayStr
  ).length;
  const todayCheckedIn = mockAttendanceRecords.filter(
    (r) => r.status === ATTENDANCE_STATUS.CHECKED_IN && r.reservationDate === todayStr
  ).length;
  const todayCheckedOut = mockAttendanceRecords.filter(
    (r) => r.status === ATTENDANCE_STATUS.CHECKED_OUT && r.reservationDate === todayStr
  ).length;
  const todayNoShow = mockAttendanceRecords.filter(
    (r) => r.status === ATTENDANCE_STATUS.NO_SHOW && r.reservationDate === todayStr
  ).length;
  const totalStudyMinutes = mockAttendanceRecords
    .filter((r) => r.reservationDate === todayStr)
    .reduce((sum, r) => sum + r.durationMinutes, 0);

  return {
    todayReservations,
    todayCheckedIn,
    todayCheckedOut,
    todayNoShow,
    totalStudyMinutes,
    pendingReservations: mockReservations.filter((r) => r.status === RESERVATION_STATUS.RESERVED),
    activeSessions: mockAttendanceRecords.filter((r) => r.status === ATTENDANCE_STATUS.CHECKED_IN),
    recentRecords: mockAttendanceRecords.slice(0, 10),
    users: mockUsers,
    seats: mockSeats,
  };
}

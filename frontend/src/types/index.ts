export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  status: string;
  metric: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend: string;
  tone: string;
}

export interface OperationRecord {
  key: string;
  name: string;
  owner: string;
  status: string;
  metric: string;
  priority: string;
}

export interface OverviewResponse {
  appName: string;
  appCode: string;
  description: string;
  features: FeatureItem[];
  kpis: KpiItem[];
  records: OperationRecord[];
}

export interface Seat {
  id: number;
  seatCode: string;
  floor: number;
  zone: string;
  status: string;
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
  status: string;
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
  status: string;
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

export interface CheckInResult {
  success: boolean;
  message: string;
  data?: AttendanceRecord;
  canCheckIn: boolean;
  minutesUntilCheckIn?: number;
}

export interface CheckOutResult {
  success: boolean;
  message: string;
  data?: AttendanceRecord;
  durationMinutes?: number;
}

export interface CheckInStatus {
  canCheckIn: boolean;
  canCheckOut: boolean;
  status: string;
  message: string;
  minutesUntilCheckIn?: number;
}

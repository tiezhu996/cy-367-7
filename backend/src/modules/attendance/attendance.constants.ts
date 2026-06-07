export const CHECK_IN_ADVANCE_MINUTES = 15;

export const MAX_NO_SHOW_BEFORE_RESTRICTION = 3;

export const RESERVATION_STATUS = {
  RESERVED: "reserved",
  CHECKED_IN: "checked_in",
  CHECKED_OUT: "checked_out",
  NO_SHOW: "no_show",
  CANCELLED: "cancelled",
} as const;

export const ATTENDANCE_STATUS = {
  PENDING: "pending",
  CHECKED_IN: "checked_in",
  CHECKED_OUT: "checked_out",
  NO_SHOW: "no_show",
} as const;

export const SEAT_STATUS = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  OCCUPIED: "occupied",
  UNAVAILABLE: "unavailable",
} as const;

export type ReservationStatus = typeof RESERVATION_STATUS[keyof typeof RESERVATION_STATUS];
export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];
export type SeatStatus = typeof SEAT_STATUS[keyof typeof SEAT_STATUS];

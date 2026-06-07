import {
  mockReservations,
  mockAttendanceRecords,
  mockNoShowRecords,
  mockUsers,
  mockSeats,
  getAttendanceOverview,
} from "./attendance.data";
import {
  CHECK_IN_ADVANCE_MINUTES,
  MAX_NO_SHOW_BEFORE_RESTRICTION,
  RESERVATION_STATUS,
  ATTENDANCE_STATUS,
  SEAT_STATUS,
} from "./attendance.constants";
import type {
  Reservation,
  AttendanceRecord,
  NoShowRecord,
  AttendanceOverview,
} from "./attendance.data";

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

export class AttendanceService {
  getOverview(): AttendanceOverview {
    return getAttendanceOverview();
  }

  getReservations(): Reservation[] {
    return mockReservations;
  }

  getAttendanceRecords(): AttendanceRecord[] {
    return mockAttendanceRecords;
  }

  getNoShowRecords(): NoShowRecord[] {
    return mockNoShowRecords;
  }

  canUserReserve(userId: number): { allowed: boolean; reason?: string } {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return { allowed: false, reason: "用户不存在" };
    }
    if (user.isRestricted) {
      return {
        allowed: false,
        reason: `您已被限制预约（爽约${user.noShowCount}次，超过${MAX_NO_SHOW_BEFORE_RESTRICTION}次）`,
      };
    }
    return { allowed: true };
  }

  checkIn(reservationId: number): CheckInResult {
    const reservation = mockReservations.find((r) => r.id === reservationId);
    if (!reservation) {
      return { success: false, message: "预约不存在", canCheckIn: false };
    }

    if (reservation.status === RESERVATION_STATUS.CHECKED_IN) {
      return { success: false, message: "已签到，无需重复签到", canCheckIn: false };
    }

    if (reservation.status === RESERVATION_STATUS.CHECKED_OUT) {
      return { success: false, message: "已签退，无法签到", canCheckIn: false };
    }

    if (reservation.status === RESERVATION_STATUS.NO_SHOW) {
      return { success: false, message: "预约已标记为爽约", canCheckIn: false };
    }

    if (reservation.status === RESERVATION_STATUS.CANCELLED) {
      return { success: false, message: "预约已取消", canCheckIn: false };
    }

    const now = new Date();
    const reservationDateTime = new Date(
      `${reservation.reservationDate}T${reservation.startTime}`
    );
    const earliestCheckInTime = new Date(
      reservationDateTime.getTime() - CHECK_IN_ADVANCE_MINUTES * 60000
    );
    const latestCheckInTime = new Date(reservationDateTime.getTime() + 10 * 60000);

    if (now < earliestCheckInTime) {
      const minutesUntil = Math.ceil(
        (earliestCheckInTime.getTime() - now.getTime()) / 60000
      );
      return {
        success: false,
        message: `签到尚未开放，请在开场前${CHECK_IN_ADVANCE_MINUTES}分钟内签到（还需等待${minutesUntil}分钟）`,
        canCheckIn: false,
        minutesUntilCheckIn: minutesUntil,
      };
    }

    if (now > latestCheckInTime) {
      this.markAsNoShow(reservationId, "签到超时，开场后10分钟未签到");
      return {
        success: false,
        message: "签到超时，已标记为爽约",
        canCheckIn: false,
      };
    }

    const checkInTime = now.toISOString();
    reservation.status = RESERVATION_STATUS.CHECKED_IN;
    reservation.checkInTime = checkInTime;

    const attendanceRecord = mockAttendanceRecords.find(
      (r) => r.reservationId === reservationId
    );
    if (attendanceRecord) {
      attendanceRecord.status = ATTENDANCE_STATUS.CHECKED_IN;
      attendanceRecord.checkInTime = checkInTime;
    }

    const seat = mockSeats.find((s) => s.id === reservation.seatId);
    if (seat) {
      seat.status = SEAT_STATUS.OCCUPIED;
    }

    return {
      success: true,
      message: "签到成功",
      canCheckIn: true,
      data: attendanceRecord || undefined,
    };
  }

  checkOut(reservationId: number): CheckOutResult {
    const reservation = mockReservations.find((r) => r.id === reservationId);
    if (!reservation) {
      return { success: false, message: "预约不存在" };
    }

    if (reservation.status !== RESERVATION_STATUS.CHECKED_IN) {
      return { success: false, message: "当前状态无法签退，请先签到" };
    }

    if (!reservation.checkInTime) {
      return { success: false, message: "签到记录异常，无法签退" };
    }

    const checkOutTime = new Date().toISOString();
    const checkInTime = new Date(reservation.checkInTime);
    const durationMinutes = Math.max(
      1,
      Math.round((new Date(checkOutTime).getTime() - checkInTime.getTime()) / 60000)
    );

    reservation.status = RESERVATION_STATUS.CHECKED_OUT;
    reservation.checkOutTime = checkOutTime;
    reservation.durationMinutes = durationMinutes;

    const attendanceRecord = mockAttendanceRecords.find(
      (r) => r.reservationId === reservationId
    );
    if (attendanceRecord) {
      attendanceRecord.status = ATTENDANCE_STATUS.CHECKED_OUT;
      attendanceRecord.checkOutTime = checkOutTime;
      attendanceRecord.durationMinutes = durationMinutes;
    }

    const seat = mockSeats.find((s) => s.id === reservation.seatId);
    if (seat) {
      seat.status = SEAT_STATUS.AVAILABLE;
    }

    return {
      success: true,
      message: `签退成功，本次学习时长${durationMinutes}分钟`,
      durationMinutes,
      data: attendanceRecord || undefined,
    };
  }

  markAsNoShow(reservationId: number, reason: string): boolean {
    const reservation = mockReservations.find((r) => r.id === reservationId);
    if (!reservation) return false;

    reservation.status = RESERVATION_STATUS.NO_SHOW;

    const attendanceRecord = mockAttendanceRecords.find(
      (r) => r.reservationId === reservationId
    );
    if (attendanceRecord) {
      attendanceRecord.status = ATTENDANCE_STATUS.NO_SHOW;
    }

    const noShowRecord: NoShowRecord = {
      id: mockNoShowRecords.length + 1,
      userId: reservation.userId,
      username: reservation.username,
      reservationId,
      reason,
      createdAt: new Date().toISOString(),
    };
    mockNoShowRecords.push(noShowRecord);

    const user = mockUsers.find((u) => u.id === reservation.userId);
    if (user) {
      user.noShowCount += 1;
      if (user.noShowCount >= MAX_NO_SHOW_BEFORE_RESTRICTION) {
        user.isRestricted = true;
      }
    }

    const seat = mockSeats.find((s) => s.id === reservation.seatId);
    if (seat && seat.status === SEAT_STATUS.RESERVED) {
      seat.status = SEAT_STATUS.AVAILABLE;
    }

    return true;
  }

  checkAndProcessNoShows(): { processed: number; restricted: number } {
    const now = new Date();
    let processed = 0;
    let restricted = 0;

    mockReservations.forEach((reservation) => {
      if (reservation.status !== RESERVATION_STATUS.RESERVED) return;

      const reservationEndTime = new Date(
        `${reservation.reservationDate}T${reservation.endTime}`
      );

      if (now > reservationEndTime && !reservation.checkInTime) {
        this.markAsNoShow(reservation.id, "预约未签到，超时自动标记");
        processed++;

        const user = mockUsers.find((u) => u.id === reservation.userId);
        if (user?.isRestricted) {
          restricted++;
        }
      }
    });

    return { processed, restricted };
  }

  getCheckInStatus(reservationId: number): {
    canCheckIn: boolean;
    canCheckOut: boolean;
    status: string;
    message: string;
    minutesUntilCheckIn?: number;
  } {
    const reservation = mockReservations.find((r) => r.id === reservationId);
    if (!reservation) {
      return {
        canCheckIn: false,
        canCheckOut: false,
        status: "not_found",
        message: "预约不存在",
      };
    }

    if (reservation.status === RESERVATION_STATUS.CHECKED_IN) {
      return {
        canCheckIn: false,
        canCheckOut: true,
        status: "checked_in",
        message: "已签到，可签退",
      };
    }

    if (reservation.status === RESERVATION_STATUS.CHECKED_OUT) {
      return {
        canCheckIn: false,
        canCheckOut: false,
        status: "checked_out",
        message: "已签退",
      };
    }

    if (reservation.status === RESERVATION_STATUS.NO_SHOW) {
      return {
        canCheckIn: false,
        canCheckOut: false,
        status: "no_show",
        message: "已标记为爽约",
      };
    }

    if (reservation.status === RESERVATION_STATUS.CANCELLED) {
      return {
        canCheckIn: false,
        canCheckOut: false,
        status: "cancelled",
        message: "预约已取消",
      };
    }

    const now = new Date();
    const reservationDateTime = new Date(
      `${reservation.reservationDate}T${reservation.startTime}`
    );
    const earliestCheckInTime = new Date(
      reservationDateTime.getTime() - CHECK_IN_ADVANCE_MINUTES * 60000
    );
    const latestCheckInTime = new Date(reservationDateTime.getTime() + 10 * 60000);

    if (now < earliestCheckInTime) {
      const minutesUntil = Math.ceil(
        (earliestCheckInTime.getTime() - now.getTime()) / 60000
      );
      return {
        canCheckIn: false,
        canCheckOut: false,
        status: "waiting",
        message: `签到尚未开放，请在开场前${CHECK_IN_ADVANCE_MINUTES}分钟内签到`,
        minutesUntilCheckIn: minutesUntil,
      };
    }

    if (now > latestCheckInTime) {
      return {
        canCheckIn: false,
        canCheckOut: false,
        status: "late",
        message: "已过签到时间",
      };
    }

    return {
      canCheckIn: true,
      canCheckOut: false,
      status: "ready",
      message: "可以签到",
    };
  }
}

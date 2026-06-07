import { Router } from "express";
import {
  getAttendanceOverview,
  getReservations,
  getAttendanceRecords,
  getNoShowRecords,
  checkCanReserve,
  checkIn,
  checkOut,
  markNoShow,
  processNoShows,
  getCheckInStatus,
} from "./attendance.controller";

export const attendanceRouter = Router();

attendanceRouter.get("/attendance/overview", getAttendanceOverview);
attendanceRouter.get("/attendance/reservations", getReservations);
attendanceRouter.get("/attendance/records", getAttendanceRecords);
attendanceRouter.get("/attendance/no-shows", getNoShowRecords);
attendanceRouter.get("/attendance/can-reserve/:userId", checkCanReserve);
attendanceRouter.get("/attendance/status/:reservationId", getCheckInStatus);
attendanceRouter.post("/attendance/check-in", checkIn);
attendanceRouter.post("/attendance/check-out", checkOut);
attendanceRouter.post("/attendance/mark-no-show", markNoShow);
attendanceRouter.post("/attendance/process-no-shows", processNoShows);

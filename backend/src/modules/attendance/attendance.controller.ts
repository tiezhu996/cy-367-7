import type { Request, Response } from "express";
import { AttendanceService } from "./attendance.service";

const service = new AttendanceService();

export function getAttendanceOverview(_request: Request, response: Response) {
  response.json(service.getOverview());
}

export function getReservations(_request: Request, response: Response) {
  response.json(service.getReservations());
}

export function getAttendanceRecords(_request: Request, response: Response) {
  response.json(service.getAttendanceRecords());
}

export function getNoShowRecords(_request: Request, response: Response) {
  response.json(service.getNoShowRecords());
}

export function checkCanReserve(request: Request, response: Response) {
  const userId = Number(request.params.userId);
  if (isNaN(userId)) {
    response.status(400).json({ success: false, message: "无效的用户ID" });
    return;
  }
  response.json(service.canUserReserve(userId));
}

export function checkIn(request: Request, response: Response) {
  const { reservationId } = request.body;
  if (!reservationId) {
    response.status(400).json({ success: false, message: "缺少预约ID" });
    return;
  }
  response.json(service.checkIn(Number(reservationId)));
}

export function checkOut(request: Request, response: Response) {
  const { reservationId } = request.body;
  if (!reservationId) {
    response.status(400).json({ success: false, message: "缺少预约ID" });
    return;
  }
  response.json(service.checkOut(Number(reservationId)));
}

export function markNoShow(request: Request, response: Response) {
  const { reservationId, reason } = request.body;
  if (!reservationId) {
    response.status(400).json({ success: false, message: "缺少预约ID" });
    return;
  }
  const result = service.markAsNoShow(
    Number(reservationId),
    reason || "管理员标记"
  );
  response.json({ success: result });
}

export function processNoShows(_request: Request, response: Response) {
  response.json(service.checkAndProcessNoShows());
}

export function getCheckInStatus(request: Request, response: Response) {
  const reservationId = Number(request.params.reservationId);
  if (isNaN(reservationId)) {
    response.status(400).json({ success: false, message: "无效的预约ID" });
    return;
  }
  response.json(service.getCheckInStatus(reservationId));
}

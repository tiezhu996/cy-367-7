import { API_BASE_URL } from "../constants/app";
import type {
  OverviewResponse,
  AttendanceOverview,
  Reservation,
  AttendanceRecord,
  NoShowRecord,
  CheckInResult,
  CheckOutResult,
  CheckInStatus,
} from "../types";

export async function fetchOverview(): Promise<OverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

export async function fetchAttendanceOverview(): Promise<AttendanceOverview> {
  const response = await fetch(`${API_BASE_URL}/attendance/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Attendance overview request failed: ${response.status}`);
  }

  return response.json() as Promise<AttendanceOverview>;
}

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await fetch(`${API_BASE_URL}/attendance/reservations`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Reservations request failed: ${response.status}`);
  }

  return response.json() as Promise<Reservation[]>;
}

export async function fetchAttendanceRecords(): Promise<AttendanceRecord[]> {
  const response = await fetch(`${API_BASE_URL}/attendance/records`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Attendance records request failed: ${response.status}`);
  }

  return response.json() as Promise<AttendanceRecord[]>;
}

export async function fetchNoShowRecords(): Promise<NoShowRecord[]> {
  const response = await fetch(`${API_BASE_URL}/attendance/no-shows`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`No-show records request failed: ${response.status}`);
  }

  return response.json() as Promise<NoShowRecord[]>;
}

export async function checkCanReserve(
  userId: number
): Promise<{ allowed: boolean; reason?: string }> {
  const response = await fetch(
    `${API_BASE_URL}/attendance/can-reserve/${userId}`,
    {
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Check reserve request failed: ${response.status}`);
  }

  return response.json() as Promise<{ allowed: boolean; reason?: string }>;
}

export async function getCheckInStatus(
  reservationId: number
): Promise<CheckInStatus> {
  const response = await fetch(
    `${API_BASE_URL}/attendance/status/${reservationId}`,
    {
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Check status request failed: ${response.status}`);
  }

  return response.json() as Promise<CheckInStatus>;
}

export async function doCheckIn(
  reservationId: number
): Promise<CheckInResult> {
  const response = await fetch(`${API_BASE_URL}/attendance/check-in`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reservationId }),
  });

  if (!response.ok) {
    throw new Error(`Check-in request failed: ${response.status}`);
  }

  return response.json() as Promise<CheckInResult>;
}

export async function doCheckOut(
  reservationId: number
): Promise<CheckOutResult> {
  const response = await fetch(`${API_BASE_URL}/attendance/check-out`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reservationId }),
  });

  if (!response.ok) {
    throw new Error(`Check-out request failed: ${response.status}`);
  }

  return response.json() as Promise<CheckOutResult>;
}

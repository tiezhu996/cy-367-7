import cors from "cors";
import express from "express";
import helmet from "helmet";
import { overviewRouter } from "./modules/overview/overview.routes";
import { attendanceRouter } from "./modules/attendance/attendance.routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => response.json({ status: "ok" }));
app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/", overviewRouter);
app.use("/", attendanceRouter);
app.use("/api", overviewRouter);
app.use("/api", attendanceRouter);

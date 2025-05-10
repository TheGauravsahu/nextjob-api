import express from "express";
import cors from "cors";
import errorMiddleware from "./src/middleware/error.middleware";
import authRoutes from "./src/routes/auth.routes";
import jobRoutes from "./src/routes/job.routes";
import homeRoute from "./src/routes/home.route";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/", homeRoute);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.use(errorMiddleware);

export default app;

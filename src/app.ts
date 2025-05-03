import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;

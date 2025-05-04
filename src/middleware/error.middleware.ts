import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

const errorMiddleware = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  console.log("Error:", err);

  res.status(statusCode).json({
    success: false,
    message,
    timestamp: Date.now(),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorMiddleware;

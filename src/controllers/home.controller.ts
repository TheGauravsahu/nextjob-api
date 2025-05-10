import { Request, Response } from "express";

export const getHomePage = (_req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Next Job API" });
};

export const getHealthCheck = (_req: Request, res: Response) => {
  res.status(200).json({ message: "API is healthy" });
};

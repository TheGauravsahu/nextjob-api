import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const validateMiddleware =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): any => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((error) => ({
        path: error.path,
        message: error.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      }); 
    }

    next();
  };

export default validateMiddleware;

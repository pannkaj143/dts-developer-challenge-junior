import type {NextFunction, Request, Response} from 'express';
import {ZodError} from 'zod';

interface ErrorResponse {
  message: string;
  details?: unknown;
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    const details = err.errors.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
    res.status(400).json({message: 'Validation failed', details});
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({message: err.message});
    return;
  }

  res.status(500).json({message: 'Unexpected error'});
};

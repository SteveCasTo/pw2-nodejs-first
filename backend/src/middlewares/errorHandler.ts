import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  const response: ErrorResponse = {
    success: false,
    message: err.message || 'Error interno del servidor',
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = err.name;
    response.stack = err.stack;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      ...response,
      message: 'Error de validación',
      errors: err,
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      ...response,
      message: 'ID inválido',
    });
    return;
  }

  if (err.name === 'MongoServerError' && 'code' in err && err.code === 11000) {
    res.status(409).json({
      ...response,
      message: 'Ya existe un registro con esos datos',
    });
    return;
  }

  res.status(500).json(response);
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
};
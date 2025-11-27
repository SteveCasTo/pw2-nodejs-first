import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/errors';
import config from '@config/constants';

interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
  stack?: string;
  errors?: unknown;
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (config.isDevelopment) {
    console.error('Error:', err);
  }

  let statusCode = 500;
  const response: ErrorResponse = {
    success: false,
    message: err.message || 'Error interno del servidor',
  };

  if (config.isDevelopment) {
    response.error = err.name;
    response.stack = err.stack;
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    response.message = 'Error de validación';
    response.errors = err;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    response.message = 'ID inválido';
  } else if (err.name === 'MongoServerError' && 'code' in err && err.code === 11000) {
    statusCode = 409;
    response.message = 'Ya existe un registro con esos datos';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    response.message = 'Token inválido';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    response.message = 'Token expirado';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    response.message = 'Error al procesar el archivo';
  }

  res.status(statusCode).json(response);
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
};

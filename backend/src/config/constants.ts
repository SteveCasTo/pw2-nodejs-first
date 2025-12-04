import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'PORT', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Faltan las siguientes variables de entorno requeridas: ${missingEnvVars.join(', ')}`
  );
}

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  PORT: parseInt(process.env.PORT || '3000', 10),
  BACKEND_URL:
    process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`,

  MONGO_URI: process.env.MONGO_URI as string,

  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Sistema de Examenes <noreply@sistema.com>',

  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export default config;

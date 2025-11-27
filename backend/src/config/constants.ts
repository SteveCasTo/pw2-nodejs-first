import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Faltan las siguientes variables de entorno requeridas: ${missingEnvVars.join(', ')}`
  );
}

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  PORT: parseInt(process.env.PORT || '4000', 10),
  BACKEND_URL: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`,
  
  MONGO_URI: process.env.MONGO_URI as string,
  
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export default config;
import app from './app';
import { connectDB } from '@config/database';
import config from '@config/constants';

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.warn(`Servidor corriendo en modo: ${config.NODE_ENV}`);
      console.warn(`Puerto: ${config.PORT}`);
      console.warn(`URL: http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
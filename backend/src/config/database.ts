import mongoose from 'mongoose';
import config from './constants';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGO_URI);

    if (config.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log('MongoDB conectado exitosamente');
    }

    mongoose.connection.on('error', err => {
      console.error('Error de conexion MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectado');
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};

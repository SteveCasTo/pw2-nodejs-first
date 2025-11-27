import app from './app';
import { connectDB } from '@config/database';
import config from '@config/constants';

// Importar modelos para registrarlos en Mongoose
import './models/categoria.model';
import './models/ciclo.model';
import './models/contenido.model';
import './models/estadoPregunta.model';
import './models/examen.model';
import './models/examenPregunta.model';
import './models/intentoExamen.model';
import './models/nivelDificultad.model';
import './models/opcionPregunta.model';
import './models/parEmparejamiento.model';
import './models/pregunta.model';
import './models/privilegio.model';
import './models/rangoEdad.model';
import './models/respuestaDesarrollo.model';
import './models/respuestaEmparejamiento.model';
import './models/respuestaModelo.model';
import './models/respuestaSeleccion.model';
import './models/revisionPregunta.model';
import './models/subcategoria.model';
import './models/usuario.model';
import './models/usuarioPrivilegio.model';

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

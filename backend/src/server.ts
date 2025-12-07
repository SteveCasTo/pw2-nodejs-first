import app from './app';
import { connectDB } from '@config/database';
import config from '@config/constants';
import http from 'http';
import https from 'https';
import spdy from 'spdy';
import fs from 'fs';
import path from 'path';

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

    const httpServer = http.createServer((req, res) => {
      (req as unknown as Record<string, unknown>).serverType = 'HTTP';
      app(req, res);
    });
    httpServer.listen(config.PORT, () => {
      console.warn(`HTTP -> http://localhost:${config.PORT}`);
    });

    const certPath = path.join(__dirname, '../certs');
    const sslOptions = {
      key: fs.readFileSync(path.join(certPath, 'key.pem')),
      cert: fs.readFileSync(path.join(certPath, 'cert.pem')),
    };

    const portHTTPS = process.env.PORT_HTTPS || '3001';
    const httpsServer = https.createServer(sslOptions, (req, res) => {
      (req as unknown as Record<string, unknown>).serverType = 'HTTPS';
      app(req, res);
    });
    httpsServer.listen(portHTTPS, () => {
      console.warn(`HTTPS (HTTP/1.1) -> https://localhost:${portHTTPS}`);
    });

    const portHTTP2 = process.env.PORT_HTTP2 || '3002';
    const http2Server = spdy.createServer(
      {
        ...sslOptions,
        spdy: {
          protocols: ['h2'],
          plain: false,
        },
      },
      (req, res) => {
        (req as unknown as Record<string, unknown>).serverType = 'HTTP2';
        app(req, res);
      }
    );
    http2Server.listen(portHTTP2, () => {
      console.warn(`HTTP/2 -> https://localhost:${portHTTP2}`);
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

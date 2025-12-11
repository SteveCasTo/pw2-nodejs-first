import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, notFound } from '@middlewares/errorHandler';
import { protect } from '@middlewares/auth';
import rangoEdadRoutes from '@routes/rangoEdad.routes';
import categoriaRoutes from '@routes/categoria.routes';
import subcategoriaRoutes from '@routes/subcategoria.routes';
import nivelDificultadRoutes from '@routes/nivelDificultad.routes';
import authRoutes from '@routes/auth.routes';
import privilegioRoutes from '@routes/privilegio.routes';
import usuarioPrivilegioRoutes from '@routes/usuarioPrivilegio.routes';
import cicloRoutes from '@routes/ciclo.routes';
import estadoPreguntaRoutes from '@routes/estadoPregunta.routes';
import contenidoRoutes from '@routes/contenido.routes';
import preguntaRoutes from '@routes/pregunta.routes';
import opcionPreguntaRoutes from '@routes/opcionPregunta.routes';
import parEmparejamientoRoutes from '@routes/parEmparejamiento.routes';
import config from '@config/constants';

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: config.BACKEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

interface RequestWithProtocol extends express.Request {
  serverType?: 'HTTP' | 'HTTPS' | 'HTTP2';
  detectedProtocol?: string;
}

app.use((req: RequestWithProtocol, res, next) => {
  const serverType = req.serverType;
  const protocol =
    serverType === 'HTTP2'
      ? 'HTTP/2.0'
      : serverType === 'HTTPS'
        ? 'HTTPS (HTTP/1.1)'
        : 'HTTP/1.1';

  res.setHeader('X-Protocol-Used', protocol);
  req.detectedProtocol = protocol;
  next();
});

app.get('/health', (req: RequestWithProtocol, res) => {
  const protocol = req.detectedProtocol || `HTTP/${req.httpVersion}`;
  res.status(200).json({
    success: true,
    message: 'Server is running',
    protocol: protocol,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);

app.use(protect);
app.use('/api/rangos-edad', rangoEdadRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/subcategorias', subcategoriaRoutes);
app.use('/api/niveles-dificultad', nivelDificultadRoutes);
app.use('/api/privilegios', privilegioRoutes);
app.use('/api/usuario-privilegios', usuarioPrivilegioRoutes);
app.use('/api/ciclos', cicloRoutes);
app.use('/api/estados-pregunta', estadoPreguntaRoutes);
app.use('/api/contenidos', contenidoRoutes);
app.use('/api/preguntas', preguntaRoutes);
app.use('/api/opciones-pregunta', opcionPreguntaRoutes);
app.use('/api/pares-emparejamiento', parEmparejamientoRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;

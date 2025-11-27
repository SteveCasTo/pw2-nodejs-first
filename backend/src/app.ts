import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler, notFound } from '@middlewares/errorHandler';
import categoriaRoutes from '@routes/categoria.routes';
import config from '@config/constants';

const app: Application = express();

app.use(
  cors({
    origin: config.BACKEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/categorias', categoriaRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;

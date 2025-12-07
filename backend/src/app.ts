import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import tasksRouter from './routes/taskRoutes.js';
import {errorHandler} from './middleware/errorHandler.js';
import {swaggerSpec} from './docs/swagger.js';

dotenv.config();

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({status: 'ok'});
});

app.use('/api/tasks', tasksRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;

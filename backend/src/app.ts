import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import requestLogger from './middlewares/requestLogger';
import router from './routes/index';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api', router);

// Add your routes here
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use(errorHandler);

export default app;

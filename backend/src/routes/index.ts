import express from 'express';
import roomRouter from './room.routes';

const router = express.Router();
router.use('/room', roomRouter);

export default router;
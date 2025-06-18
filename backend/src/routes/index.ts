import express from 'express';
import roomRouter from './room.routes';
import chatRouter from './chat.routes';

const router = express.Router();
router.use('/room', roomRouter);
router.use('/chat', chatRouter);

export default router;
import express from 'express';
import roomRouter from './room.routes';
import chatRouter from './chat.routes';
import authRouter from './auth.routes';
import userRouter from './user.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/room', roomRouter);
router.use('/chat', chatRouter);
router.use('/user', userRouter);

export default router;
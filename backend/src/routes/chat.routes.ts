import express from 'express';
import { getChatsByRoomId } from '../controllers/chat.controller';

const router = express.Router();

router.get('/:roomId', getChatsByRoomId);

export default router;
import express from 'express';
import { getChatsByRoom } from '../controllers/chat.controller';

const router = express.Router();

router.get('/:roomName', getChatsByRoom);

export default router;
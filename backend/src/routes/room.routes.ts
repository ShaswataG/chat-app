// routes/chat.routes.ts
import express from 'express';
import { getRooms, getRoomById } from '../controllers/room.controller';

const router = express.Router();

router.get('/', getRooms);
router.get('/:roomId', getRoomById);

export default router;
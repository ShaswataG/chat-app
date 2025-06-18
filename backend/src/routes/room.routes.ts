// routes/chat.routes.ts
import express from 'express';
import { getRooms } from '../controllers/room.controller';

const router = express.Router();

router.get('/', getRooms);

export default router;
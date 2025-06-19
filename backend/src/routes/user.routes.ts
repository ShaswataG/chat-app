import express, { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { getJoinedRooms } from '../controllers/user.controller';

const userRouter: Router = express.Router();

userRouter.get('/joinedRooms', verifyToken, getJoinedRooms);

export default userRouter;
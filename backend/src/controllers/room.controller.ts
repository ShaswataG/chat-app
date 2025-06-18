import { Request, Response, NextFunction } from "express"
import { Room } from "../models/room.model"
import { successResponse } from "../utils/apiResponse";

export const getRooms = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json(successResponse({
            message: "Fetched all rooms",
            data: rooms
        }))
    } catch (error) {
        next(error);
    }
}
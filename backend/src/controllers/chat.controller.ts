import { Chat } from "../models/chat.model";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse";

export const getChatsByRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomName } = req.params;
        const chats = await Chat.find({ room: roomName });
        res.status(200).json(successResponse({
            message: "Fetched all chats of the room",
            data: chats
        }))
    } catch (error) {
        next(error)
    }
}
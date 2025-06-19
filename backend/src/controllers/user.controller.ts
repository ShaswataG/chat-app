import e from 'express';
import { User } from '../models/user.model';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const getJoinedRooms = async (req: any, res: any, next: any) => {
    try {
        const { id: userId } = req.user; // assuming req.user is populated by verifyToken middleware
        const user = await User.findById(userId).populate('joined_rooms_ids');
        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }
        return res.status(200).json(successResponse({
            message: 'Fetched joined rooms successfully',
            data: user.joined_rooms_ids
        }));
    } catch (error) {
        next(error);
    }
}
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { successResponse, errorResponse } from '../utils/apiResponse';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

// console.log('JWT_SECRET:', JWT_SECRET);

// export const signup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
//   try {
//     const { name, password } = req.body;
//     if (!name || !password) {
//       return res.status(400).json(errorResponse('Name and password are required', 400));
//     }
//     const existingUser = await User.findOne({ name });
//     if (existingUser)
//       return res.status(409).json(errorResponse('Username already taken', 409));

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, password: hashedPassword });
//     return res.status(201).json(successResponse({ id: user._id, name: user.name }, 'User created successfully'));
//   } catch (error) {
//     next(error);
//   }
// };


export const signup = async (req: any, res: any) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json(errorResponse('Name and password are required', 400));
    }
    const existingUser = await User.findOne({ name });
    if (existingUser)
      return res.status(409).json(errorResponse('Username already taken', 409));

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, password: hashedPassword });
    return res.status(201).json(successResponse({ id: user._id, name: user.name }, 'User created successfully'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error', 500));
  }
};

// export const signin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
//   try {
//     const { name, password } = req.body;
//     if (!name || !password) {
//       return res.status(400).json(errorResponse('Name and password are required', 400));
//     }
//     const user = await User.findOne({ name });
//     if (!user) return res.status(401).json(errorResponse('Invalid credentials', 401));

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json(errorResponse('Invalid credentials', 401));

//     const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '1d' });
//     return res.status(201).json(successResponse({ token, user: { id: user._id, name: user.name } }, 'Login successful'));
//   } catch (error) {
//     next(error);
//   }
// };

export const signin = async (req: any, res: any): Promise<any | void> => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json(errorResponse('Name and password are required', 400));
    }
    const user = await User.findOne({ name });
    if (!user) return res.status(401).json(errorResponse('Invalid credentials', 401));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json(errorResponse('Invalid credentials', 401));

    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(201).json(successResponse({ token, user: { id: user._id, name: user.name } }, 'Login successful'));
  } catch (error) {
    console.error('Error during signin:', error);
    return res.status(500).json(errorResponse('Internal server error', 500));
  }
};
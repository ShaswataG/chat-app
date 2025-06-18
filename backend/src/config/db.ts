import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URL is not defined in environment variables');
}

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected')
    } catch (error) {
        console.error('MongoDB connection failed: ', error);
        process.exit(1);
    }
}
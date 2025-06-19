import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        joined_rooms_ids: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Room'
            }
        ]
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model('User', userSchema);
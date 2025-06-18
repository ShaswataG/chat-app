import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  room_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room",
    required: true 
  },
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const Chat = mongoose.model('Chat', chatSchema);
import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true}
);

export const Room = mongoose.model('Room', roomSchema);
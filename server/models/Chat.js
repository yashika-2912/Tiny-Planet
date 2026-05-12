import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);

import crypto from 'crypto';
import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  time: String,
  place: String,
  description: String,
  estimatedCost: Number,
  coordinates: { lat: Number, lng: Number }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: String,
  budget: Number,
  days: Number,
  interests: [String],
  travelType: String,
  itinerary: [{ day: Number, slots: [slotSchema] }],
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
  budgetBreakdown: {
    hotel: Number,
    food: Number,
    transport: Number,
    activities: Number
  },
  totalCost: Number,
  shareToken: { type: String, unique: true }
}, { timestamps: true });

tripSchema.pre('validate', function addShareToken(next) {
  if (!this.shareToken) this.shareToken = crypto.randomBytes(12).toString('hex');
  next();
});

export default mongoose.model('Trip', tripSchema);

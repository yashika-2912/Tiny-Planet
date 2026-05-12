import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  coordinates: { lat: Number, lng: Number },
  pricePerNight: Number,
  rating: Number,
  amenities: [String],
  images: [String],
  source: { type: String, enum: ['google_places', 'opentripmap', 'seeded'], default: 'seeded' }
}, { timestamps: true });

export default mongoose.model('Hotel', hotelSchema);

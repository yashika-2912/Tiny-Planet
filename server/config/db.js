import mongoose from 'mongoose';

export default async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set. API will run with in-memory fallbacks where available.');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
  }
}

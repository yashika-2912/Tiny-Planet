import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: String,
  googleId: String,
  profileImage: String,
  preferences: {
    interests: [String],
    travelStyle: String
  },
  savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
}, { timestamps: true });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password || '');
};

export default mongoose.model('User', userSchema);

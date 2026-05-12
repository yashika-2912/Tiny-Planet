import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const memoryStore = {
  users: [],
  trips: [],
  chats: []
};

export const isMongoReady = () => Boolean(process.env.MONGO_URI);

export const publicUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage,
  preferences: user.preferences || { interests: [], travelStyle: 'solo' }
});

export const createMemoryUser = async ({ name, email, password }) => {
  const normalized = String(email).toLowerCase();
  if (memoryStore.users.some((user) => user.email === normalized)) return null;
  const user = {
    _id: crypto.randomUUID(),
    name,
    email: normalized,
    password: await bcrypt.hash(password, 12),
    preferences: { interests: [], travelStyle: 'solo' },
    savedTrips: [],
    createdAt: new Date()
  };
  memoryStore.users.push(user);
  return user;
};

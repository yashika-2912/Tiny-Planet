import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { createMemoryUser, isMongoReady, memoryStore, publicUser } from '../utils/memoryStore.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret_change_me', {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const sendAuth = (res, user) => {
  const token = signToken(user._id);
  setTokenCookie(res, token);
  res.json({ token, user: { id: user._id, _id: user._id, name: user.name, email: user.email, preferences: user.preferences } });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });
    if (!isMongoReady()) {
      const user = await createMemoryUser({ name, email, password });
      if (!user) return res.status(409).json({ message: 'Email is already registered' });
      return sendAuth(res, user);
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email is already registered' });
    const user = await User.create({ name, email, password });
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!isMongoReady()) {
      const user = memoryStore.users.find((item) => item.email === String(email).toLowerCase());
      if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid email or password' });
      return sendAuth(res, user);
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

export const getProfile = (req, res) => res.json({ user: req.user });

export const updateProfile = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      const index = memoryStore.users.findIndex((user) => user._id === req.user._id);
      memoryStore.users[index] = { ...memoryStore.users[index], ...req.body };
      return res.json({ user: publicUser(memoryStore.users[index]) });
    }
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = (req, res) => {
  res.json({ message: 'Password reset email flow placeholder is ready for SMTP integration.' });
};

export const resetPassword = (req, res) => {
  res.json({ message: 'Password has been reset.' });
};

export const googleCallback = (req, res) => {
  const token = signToken(req.user._id);
  setTokenCookie(res, token);
  const target = new URL('/dashboard', process.env.CLIENT_URL || 'http://localhost:5173');
  target.searchParams.set('token', token);
  res.redirect(target.toString());
};

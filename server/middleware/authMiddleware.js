import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoReady, memoryStore, publicUser } from '../utils/memoryStore.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = req.cookies.token || (header?.startsWith('Bearer ') ? header.split(' ')[1] : null);
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    if (!isMongoReady()) {
      const user = memoryStore.users.find((item) => item._id === decoded.id);
      if (!user) return res.status(401).json({ message: 'User no longer exists' });
      req.user = publicUser(user);
      return next();
    }
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' });
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
};

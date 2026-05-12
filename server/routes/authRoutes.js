import express from 'express';
import { forgotPassword, getProfile, login, register, resetPassword, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/google', (req, res) => res.status(501).json({ message: 'Google OAuth Passport strategy is ready to configure with client credentials.' }));

export default router;

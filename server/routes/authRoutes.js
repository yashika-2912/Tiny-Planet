import express from 'express';
import { forgotPassword, getProfile, googleCallback, login, register, resetPassword, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import passport, { hasGoogleCredentials } from '../config/passport.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/google', (req, res, next) => {
  if (!hasGoogleCredentials) return res.status(501).json({ message: 'Google OAuth credentials are not configured.' });
  return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
  if (!hasGoogleCredentials) return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?oauth=missing`);
  return passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?oauth=failed` })(req, res, next);
}, googleCallback);

export default router;

import express from 'express';
import { hotelSearch, recommendations } from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', protect, hotelSearch);
router.get('/recommendations', protect, recommendations);

export default router;

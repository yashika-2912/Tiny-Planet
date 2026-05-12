import express from 'express';
import { chatHandler, chatHistory, generateItineraryHandler } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-itinerary', protect, generateItineraryHandler);
router.post('/chat', protect, chatHandler);
router.get('/chat/:tripId', protect, chatHistory);

export default router;

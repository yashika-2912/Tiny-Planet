import express from 'express';
import { geocodeItineraryHandler, routeSummaryHandler } from '../controllers/mapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/geocode-itinerary', protect, geocodeItineraryHandler);
router.post('/route-summary', protect, routeSummaryHandler);

export default router;

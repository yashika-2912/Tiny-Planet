import express from 'express';
import { createTrip, deleteTrip, getSharedTrip, getTrip, getTrips, updateTrip } from '../controllers/tripController.js';
import { downloadTripPDF } from '../controllers/pdfController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createTrip);
router.get('/all', protect, getTrips);
router.get('/share/:token', getSharedTrip);
router.get('/:id', protect, getTrip);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

// Download itinerary as PDF
router.get('/:id/download-pdf', protect, downloadTripPDF);

export default router;

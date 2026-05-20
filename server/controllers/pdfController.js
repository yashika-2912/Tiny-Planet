import PDFDocument from 'pdfkit';
import Trip from '../models/Trip.js';
import { isMongoReady, memoryStore } from '../utils/memoryStore.js';

export const downloadTripPDF = async (req, res, next) => {
    try {
        let trip;
        if (!isMongoReady()) {
            trip = memoryStore.trips.find((item) => item._id === req.params.id && (!item.userId || item.userId === req.user?._id));
        } else {
            trip = await Trip.findById(req.params.id);
            if (trip && trip.userId && req.user && trip.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
        }
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        const doc = new PDFDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="itinerary-${trip.destination || 'trip'}.pdf"`);
        doc.pipe(res);

        doc.fontSize(22).text('Tiny Planet — Trip Itinerary', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Destination: ${trip.destination}`);
        doc.text(`Days: ${trip.days}`);
        doc.text(`Budget: ₹${trip.budget}`);
        doc.text(`Travel Type: ${trip.travelType}`);
        doc.moveDown();
        doc.fontSize(18).text('Itinerary:', { underline: true });
        doc.moveDown(0.5);
        trip.itinerary.forEach((day) => {
            doc.fontSize(15).text(`Day ${day.day}`, { underline: true });
            day.slots.forEach((slot) => {
                doc.fontSize(12).text(`- ${slot.time}: ${slot.place} — ${slot.description} (₹${slot.estimatedCost})`);
            });
            doc.moveDown(0.5);
        });
        doc.moveDown();
        doc.fontSize(16).text('Budget Breakdown:', { underline: true });
        Object.entries(trip.budgetBreakdown || {}).forEach(([cat, amt]) => {
            doc.fontSize(12).text(`${cat[0].toUpperCase() + cat.slice(1)}: ₹${amt}`);
        });
        if (trip.tips && trip.tips.length) {
            doc.moveDown();
            doc.fontSize(16).text('Tips:', { underline: true });
            trip.tips.forEach((tip, i) => doc.fontSize(12).text(`${i + 1}. ${tip}`));
        }
        doc.end();
    } catch (error) {
        next(error);
    }
};

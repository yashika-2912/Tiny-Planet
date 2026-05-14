import { geocodeItinerary, routeSummary } from '../services/mapService.js';

export const geocodeItineraryHandler = async (req, res, next) => {
  try {
    const places = await geocodeItinerary(req.body);
    res.json({ places });
  } catch (error) {
    next(error);
  }
};

export const routeSummaryHandler = async (req, res, next) => {
  try {
    const summary = await routeSummary(req.body.places || []);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
};

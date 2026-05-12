import { searchHotels } from '../services/recommendationService.js';

export const hotelSearch = async (req, res, next) => {
  try {
    const hotels = await searchHotels(req.query);
    res.json({ hotels });
  } catch (error) {
    next(error);
  }
};

export const recommendations = async (req, res, next) => {
  try {
    const hotels = await searchHotels({ destination: req.query.destination || 'Goa', budget: req.query.budget || 10000 });
    res.json({ hotels });
  } catch (error) {
    next(error);
  }
};

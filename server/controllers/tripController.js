import Trip from '../models/Trip.js';
import { isMongoReady, memoryStore } from '../utils/memoryStore.js';
import crypto from 'crypto';

export const createTrip = async (req, res, next) => {
  try {
    const totalCost = req.body.itinerary?.flatMap((day) => day.slots || [])
      .reduce((sum, slot) => sum + Number(slot.estimatedCost || 0), 0);
    if (!isMongoReady()) {
      const trip = {
        ...req.body,
        _id: crypto.randomUUID(),
        userId: req.user._id,
        totalCost,
        shareToken: crypto.randomBytes(12).toString('hex'),
        createdAt: new Date()
      };
      memoryStore.trips.unshift(trip);
      return res.status(201).json({ trip });
    }
    const trip = await Trip.create({ ...req.body, totalCost, userId: req.user._id });
    res.status(201).json({ trip });
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      return res.json({ trips: memoryStore.trips.filter((trip) => trip.userId === req.user._id) });
    }
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ trips });
  } catch (error) {
    next(error);
  }
};

export const getTrip = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      const trip = memoryStore.trips.find((item) => item._id === req.params.id && item.userId === req.user._id);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      return res.json({ trip });
    }
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ trip });
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      const index = memoryStore.trips.findIndex((item) => item._id === req.params.id && item.userId === req.user._id);
      if (index < 0) return res.status(404).json({ message: 'Trip not found' });
      memoryStore.trips[index] = { ...memoryStore.trips[index], ...req.body };
      return res.json({ trip: memoryStore.trips[index] });
    }
    const trip = await Trip.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ trip });
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      const index = memoryStore.trips.findIndex((item) => item._id === req.params.id && item.userId === req.user._id);
      if (index < 0) return res.status(404).json({ message: 'Trip not found' });
      memoryStore.trips.splice(index, 1);
      return res.json({ message: 'Trip deleted' });
    }
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    next(error);
  }
};

export const getSharedTrip = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      const trip = memoryStore.trips.find((item) => item.shareToken === req.params.token);
      if (!trip) return res.status(404).json({ message: 'Shared trip not found' });
      return res.json({ trip });
    }
    const trip = await Trip.findOne({ shareToken: req.params.token }).select('-userId');
    if (!trip) return res.status(404).json({ message: 'Shared trip not found' });
    res.json({ trip });
  } catch (error) {
    next(error);
  }
};

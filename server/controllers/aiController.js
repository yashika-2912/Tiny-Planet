import Chat from '../models/Chat.js';
import Trip from '../models/Trip.js';
import { chatWithTiny, generateItinerary } from '../services/aiService.js';
import { isMongoReady, memoryStore } from '../utils/memoryStore.js';

export const generateItineraryHandler = async (req, res, next) => {
  try {
    const result = await generateItinerary(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const chatHandler = async (req, res, next) => {
  try {
    const { message, tripId, tripContext } = req.body;
    if (!isMongoReady()) {
      const activeTrip = tripContext || memoryStore.trips.find((trip) => trip._id === tripId && trip.userId === req.user._id);
      let chat = memoryStore.chats.find((item) => item.userId === req.user._id && item.tripId === tripId);
      if (!chat) {
        chat = { userId: req.user._id, tripId, messages: [] };
        memoryStore.chats.push(chat);
      }
      const reply = await chatWithTiny({ message, tripContext: activeTrip, history: chat.messages });
      chat.messages.push({ role: 'user', content: message, timestamp: new Date() }, { role: 'assistant', content: reply, timestamp: new Date() });
      return res.json({ messages: chat.messages });
    }
    const activeTrip = tripContext || (tripId ? await Trip.findOne({ _id: tripId, userId: req.user._id }) : null);
    let chat = tripId ? await Chat.findOne({ userId: req.user._id, tripId }) : null;
    if (!chat) chat = new Chat({ userId: req.user._id, tripId, messages: [] });
    const reply = await chatWithTiny({ message, tripContext: activeTrip, history: chat.messages });
    chat.messages.push({ role: 'user', content: message }, { role: 'assistant', content: reply });
    await chat.save();
    res.json({ messages: chat.messages });
  } catch (error) {
    next(error);
  }
};

export const chatHistory = async (req, res, next) => {
  try {
    if (!isMongoReady()) {
      const chat = memoryStore.chats.find((item) => item.userId === req.user._id && item.tripId === req.params.tripId);
      return res.json({ messages: chat?.messages || [] });
    }
    const chat = await Chat.findOne({ userId: req.user._id, tripId: req.params.tripId });
    res.json({ messages: chat?.messages || [] });
  } catch (error) {
    next(error);
  }
};

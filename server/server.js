import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cron from 'node-cron';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import { errorMiddleware, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:4173'
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'AI route limit reached. Try again in a few minutes.' }
});

app.get('/health', (req, res) => res.send('ok'));
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/hotels', hotelRoutes);
app.use(notFound);
app.use(errorMiddleware);

cron.schedule('0 * * * *', () => {
  console.log('session cleanup heartbeat');
});

app.listen(port, () => {
  console.log(`Tiny Planet API running on port ${port}`);
});

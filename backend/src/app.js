import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import theatreRoutes from './routes/theatreRoutes.js';
import showRoutes from './routes/showRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import snackRoutes from './routes/snackRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'CineVerse 3D API Service',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/snacks', snackRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;

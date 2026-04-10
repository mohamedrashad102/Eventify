import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './middlewares/loggerMiddleware.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(logger);

// Rate limiting
app.use('/api', apiLimiter);

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Eventify API is running!',
        version: '1.0.0'
    });
});

// API Routes (to be added by other team members)
app.use('/api/auth', authRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/admin', adminRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler); // Handle 404 - undefined routes
app.use(errorHandler); // Handle errors

export default app;
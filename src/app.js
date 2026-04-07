import express from 'express';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Eventify API is running!',
        version: '1.0.0'
    });
});

export default app;
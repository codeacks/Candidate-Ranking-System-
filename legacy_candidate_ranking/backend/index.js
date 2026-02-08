import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import candidateRoutes from './routes/candidateRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';
import { startCronJobs } from './cron/rankingCron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure JSON pretty-printing
app.set('json spaces', 2);

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('AI Candidate Ranking System API is running! Use /api/health to check status.');
});
app.use('/api/candidates', candidateRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/rankings', rankingRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startCronJobs();
});

export default app;

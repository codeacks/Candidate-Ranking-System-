import * as rankingService from '../services/rankingService.js';

export const getAllRankings = async (req, res) => {
    try {
        const rankings = await rankingService.getAllRankings();
        res.json(rankings);
    } catch (error) {
        console.error('Error fetching rankings:', error);
        res.status(500).json({ error: 'Failed to fetch rankings' });
    }
};

export const getTopRankings = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const rankings = await rankingService.getTopRankings(limit);
        res.json(rankings);
    } catch (error) {
        console.error('Error fetching top rankings:', error);
        res.status(500).json({ error: 'Failed to fetch top rankings' });
    }
};

export const recalculateRankings = async (req, res) => {
    try {
        const result = await rankingService.recalculateRankings();
        res.json(result);
    } catch (error) {
        console.error('Error recalculating rankings:', error);
        res.status(500).json({ error: 'Failed to recalculate rankings' });
    }
};

export const getSystemMetrics = async (req, res) => {
    try {
        const metrics = await rankingService.getSystemMetrics();
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching system metrics:', error);
        res.status(500).json({ error: 'Failed to fetch system metrics' });
    }
};

import cron from 'node-cron';
import { recalculateRankings } from '../services/rankingService.js';

export const startCronJobs = () => {
    // Recalculate rankings every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled ranking recalculation...');
        try {
            await recalculateRankings();
        } catch (error) {
            console.error('Cron job error:', error);
        }
    });

    console.log('Cron jobs initialized - rankings will update every hour');
};

import express from 'express';
import * as rankingController from '../controllers/rankingController.js';

const router = express.Router();

router.get('/', rankingController.getAllRankings);
router.get('/top', rankingController.getTopRankings);
router.get('/metrics', rankingController.getSystemMetrics);
router.post('/recalculate', rankingController.recalculateRankings);

export default router;

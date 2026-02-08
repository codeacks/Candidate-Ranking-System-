import express from 'express';
import * as evaluationController from '../controllers/evaluationController.js';

const router = express.Router();

router.get('/', evaluationController.getAllEvaluations);
router.post('/run', evaluationController.evaluateAllCandidates);
router.post('/run/:id', evaluationController.evaluateSingleCandidate);

export default router;

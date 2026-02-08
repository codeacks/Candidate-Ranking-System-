import * as evaluationService from '../services/evaluationService.js';
import * as candidateService from '../services/candidateService.js';
import * as rankingService from '../services/rankingService.js';

export const evaluateAllCandidates = async (req, res) => {
    try {
        const candidates = await candidateService.getAllCandidates();
        const results = [];

        for (const candidate of candidates) {
            const scores = await evaluationService.evaluateCandidate(candidate);
            await evaluationService.saveEvaluation(candidate.id, scores);
            results.push({ candidateId: candidate.id, ...scores });
        }

        // Recalculate rankings after evaluation
        await rankingService.recalculateRankings();

        res.json({
            message: `Evaluated ${results.length} candidates`,
            evaluations: results
        });
    } catch (error) {
        console.error('Error evaluating candidates:', error);
        res.status(500).json({ error: 'Failed to evaluate candidates' });
    }
};

export const evaluateSingleCandidate = async (req, res) => {
    try {
        const candidate = await candidateService.getCandidateById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        const scores = await evaluationService.evaluateCandidate(candidate);
        await evaluationService.saveEvaluation(candidate.id, scores);

        res.json({ candidateId: candidate.id, ...scores });
    } catch (error) {
        console.error('Error evaluating candidate:', error);
        res.status(500).json({ error: 'Failed to evaluate candidate' });
    }
};

export const getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await evaluationService.getAllEvaluations();
        res.json(evaluations);
    } catch (error) {
        console.error('Error fetching evaluations:', error);
        res.status(500).json({ error: 'Failed to fetch evaluations' });
    }
};

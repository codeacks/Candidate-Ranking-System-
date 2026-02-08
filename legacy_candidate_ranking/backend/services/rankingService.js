import pool from '../config/db.js';
import * as candidateService from './candidateService.js';
import * as evaluationService from './evaluationService.js';

export const recalculateRankings = async () => {
    // 1. Find all candidates without evaluations
    const [unevaluated] = await pool.query(`
        SELECT c.* FROM candidates c
        LEFT JOIN evaluations e ON c.id = e.candidate_id
        WHERE e.id IS NULL
    `);

    console.log(`Found ${unevaluated.length} candidates needing evaluation.`);

    // 2. Evaluate each and save
    for (const candidate of unevaluated) {
        const scores = await evaluationService.evaluateCandidate(candidate);
        await evaluationService.saveEvaluation(candidate.id, scores);
    }

    // 3. Clear existing rankings
    await pool.query('DELETE FROM rankings');

    // 4. Insert new rankings using RANK() window function
    await pool.query(`
        INSERT INTO rankings (candidate_id, total_score, rank_position)
        SELECT 
            candidate_id,
            (crisis_management_score + sustainability_score + team_motivation_score) AS total_score,
            RANK() OVER (ORDER BY 
                (crisis_management_score + sustainability_score + team_motivation_score) DESC) AS rank_position
        FROM evaluations
    `);

    console.log('Rankings recalculated at', new Date().toISOString());
    return {
        success: true,
        evaluations_generated: unevaluated.length,
        timestamp: new Date().toISOString()
    };
};

export const getAllRankings = async () => {
    const [rows] = await pool.query(`
        SELECT 
            r.rank_position,
            r.total_score,
            r.updated_at,
            c.id as candidate_id,
            c.name,
            c.experience_years,
            c.skills,
            e.crisis_management_score,
            e.sustainability_score,
            e.team_motivation_score
        FROM rankings r
        JOIN candidates c ON r.candidate_id = c.id
        JOIN evaluations e ON r.candidate_id = e.candidate_id
        ORDER BY r.rank_position ASC
    `);
    return rows;
};

export const getTopRankings = async (limit = 10) => {
    const [rows] = await pool.query(`
        SELECT 
            r.rank_position,
            r.total_score,
            c.id as candidate_id,
            c.name,
            c.experience_years,
            c.skills,
            e.crisis_management_score,
            e.sustainability_score,
            e.team_motivation_score
        FROM rankings r
        JOIN candidates c ON r.candidate_id = c.id
        JOIN evaluations e ON r.candidate_id = e.candidate_id
        ORDER BY r.rank_position ASC
        LIMIT ?
    `, [limit]);
    return rows;
};

export const getSystemMetrics = async () => {
    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM candidates');
    const [avgResult] = await pool.query('SELECT AVG(total_score) as avg_score FROM rankings');
    const [topResult] = await pool.query(`
        SELECT c.name, r.total_score
        FROM rankings r
        JOIN candidates c ON r.candidate_id = c.id
        ORDER BY r.rank_position ASC
        LIMIT 1
    `);

    return {
        totalCandidates: totalResult[0].total,
        averageScore: parseFloat(avgResult[0].avg_score?.toFixed(2)) || 0,
        topCandidate: topResult[0] || null
    };
};

import pool from '../config/db.js';

// Explicit AI Prompts for requirements compliance
export const PROMPTS = {
    CRISIS_MANAGEMENT: `
Evaluate this candidate for crisis management ability in a recycling plant.
Candidate Experience: {experience_years} years
Skills: {skills}
Give a score from 1-10 only.`,
    SUSTAINABILITY: `
Evaluate the candidate's sustainability knowledge for a recycling production environment.
Experience: {experience_years} years
Skills: {skills}
Return only a score (1-10).`,
    TEAM_MOTIVATION: `
Assess this candidate's ability to motivate operational teams in an industrial environment.
Experience: {experience_years} years
Skills: {skills}
Return only a score (1-10).`
};

// Mock AI evaluation - simulates processing the prompts above
export const evaluateCandidate = async (candidate) => {
    const { experience_years, skills } = candidate;

    // Parse skills
    const skillsLower = skills.toLowerCase();

    // Crisis Management Score (1-10)
    let crisisScore = 5;
    if (skillsLower.includes('crisis management')) crisisScore += 2;
    if (skillsLower.includes('safety compliance')) crisisScore += 1;
    if (skillsLower.includes('quality control')) crisisScore += 1;
    if (experience_years > 10) crisisScore += 1;
    crisisScore = Math.min(10, crisisScore + Math.random() * 1.5 - 0.75);

    // Sustainability Score (1-10)
    let sustainabilityScore = 5;
    if (skillsLower.includes('sustainability')) sustainabilityScore += 2;
    if (skillsLower.includes('waste recycling')) sustainabilityScore += 2;
    if (skillsLower.includes('lean manufacturing')) sustainabilityScore += 1;
    if (experience_years > 8) sustainabilityScore += 1;
    sustainabilityScore = Math.min(10, sustainabilityScore + Math.random() * 1.5 - 0.75);

    // Team Motivation Score (1-10)
    let motivationScore = 5;
    if (skillsLower.includes('team leadership')) motivationScore += 2;
    if (skillsLower.includes('process optimization')) motivationScore += 1;
    if (experience_years > 5) motivationScore += 1;
    if (experience_years > 12) motivationScore += 1;
    motivationScore = Math.min(10, motivationScore + Math.random() * 1.5 - 0.75);

    return {
        crisis_management_score: parseFloat(crisisScore.toFixed(2)),
        sustainability_score: parseFloat(sustainabilityScore.toFixed(2)),
        team_motivation_score: parseFloat(motivationScore.toFixed(2))
    };
};

export const saveEvaluation = async (candidateId, scores) => {
    const { crisis_management_score, sustainability_score, team_motivation_score } = scores;
    const [result] = await pool.query(
        `INSERT INTO evaluations (candidate_id, crisis_management_score, sustainability_score, team_motivation_score)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         crisis_management_score = VALUES(crisis_management_score),
         sustainability_score = VALUES(sustainability_score),
         team_motivation_score = VALUES(team_motivation_score)`,
        [candidateId, crisis_management_score, sustainability_score, team_motivation_score]
    );
    return result;
};

export const getEvaluationByCandidateId = async (candidateId) => {
    const [rows] = await pool.query(
        'SELECT * FROM evaluations WHERE candidate_id = ?',
        [candidateId]
    );
    return rows[0];
};

export const getAllEvaluations = async () => {
    const [rows] = await pool.query(`
        SELECT e.*, c.name, c.experience_years, c.skills
        FROM evaluations e
        JOIN candidates c ON e.candidate_id = c.id
        ORDER BY e.id
    `);
    return rows;
};

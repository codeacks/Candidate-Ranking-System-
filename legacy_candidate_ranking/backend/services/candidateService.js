import pool from '../config/db.js';

export const getAllCandidates = async () => {
    const [rows] = await pool.query('SELECT * FROM candidates ORDER BY id');
    return rows;
};

export const getCandidateById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM candidates WHERE id = ?', [id]);
    return rows[0];
};

export const createCandidate = async (candidate) => {
    const { name, experience_years, skills } = candidate;
    const [result] = await pool.query(
        'INSERT INTO candidates (name, experience_years, skills) VALUES (?, ?, ?)',
        [name, experience_years, skills]
    );
    return { id: result.insertId, ...candidate };
};

export const bulkInsertCandidates = async (candidates) => {
    const values = candidates.map(c => [c.name, c.experience_years, c.skills]);
    const [result] = await pool.query(
        'INSERT INTO candidates (name, experience_years, skills) VALUES ?',
        [values]
    );
    return result;
};

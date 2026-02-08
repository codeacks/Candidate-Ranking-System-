import fs from 'fs';
import pool from './config/db.js';

const seedDatabase = async () => {
    try {
        // Read candidates from generated JSON
        const candidatesData = JSON.parse(fs.readFileSync('candidates.json', 'utf-8'));

        // Check if candidates already exist
        const [existing] = await pool.query('SELECT COUNT(*) as count FROM candidates');
        if (existing[0].count > 0) {
            console.log('Database already has candidates. Skipping seed.');
            process.exit(0);
        }

        // Insert candidates
        const values = candidatesData.map(c => [c.name, c.experience_years, c.skills]);
        const [result] = await pool.query(
            'INSERT INTO candidates (name, experience_years, skills) VALUES ?',
            [values]
        );

        console.log(`Inserted ${result.affectedRows} candidates into database.`);

        // Now evaluate all candidates
        const [candidates] = await pool.query('SELECT * FROM candidates');

        for (const candidate of candidates) {
            const scores = generateMockScores(candidate);
            await pool.query(
                'INSERT INTO evaluations (candidate_id, crisis_management_score, sustainability_score, team_motivation_score) VALUES (?, ?, ?, ?)',
                [candidate.id, scores.crisis_management_score, scores.sustainability_score, scores.team_motivation_score]
            );
        }

        console.log(`Evaluated ${candidates.length} candidates.`);

        // Calculate rankings
        await pool.query('DELETE FROM rankings');
        await pool.query(`
            INSERT INTO rankings (candidate_id, total_score, rank_position)
            SELECT 
                candidate_id,
                (crisis_management_score + sustainability_score + team_motivation_score) AS total_score,
                RANK() OVER (ORDER BY 
                    (crisis_management_score + sustainability_score + team_motivation_score) DESC) AS rank_position
            FROM evaluations
        `);

        console.log('Rankings calculated.');
        console.log('Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

const generateMockScores = (candidate) => {
    const { experience_years, skills } = candidate;
    const skillsLower = skills.toLowerCase();

    let crisisScore = 5;
    if (skillsLower.includes('crisis management')) crisisScore += 2;
    if (skillsLower.includes('safety compliance')) crisisScore += 1;
    if (skillsLower.includes('quality control')) crisisScore += 1;
    if (experience_years > 10) crisisScore += 1;
    crisisScore = Math.min(10, crisisScore + Math.random() * 1.5 - 0.75);

    let sustainabilityScore = 5;
    if (skillsLower.includes('sustainability')) sustainabilityScore += 2;
    if (skillsLower.includes('waste recycling')) sustainabilityScore += 2;
    if (skillsLower.includes('lean manufacturing')) sustainabilityScore += 1;
    if (experience_years > 8) sustainabilityScore += 1;
    sustainabilityScore = Math.min(10, sustainabilityScore + Math.random() * 1.5 - 0.75);

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

seedDatabase();

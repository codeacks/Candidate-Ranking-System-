import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const applySchema = async () => {
    try {
        const pool = await mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'candidate_ranking',
            multipleStatements: true
        });

        const schema = fs.readFileSync('schema.sql', 'utf8');
        await pool.query(schema);

        console.log('Schema applied successfully.');
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Error applying schema:', error);
        process.exit(1);
    }
};

applySchema();

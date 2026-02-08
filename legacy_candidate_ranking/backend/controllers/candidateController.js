import * as candidateService from '../services/candidateService.js';
import * as evaluationService from '../services/evaluationService.js';
import xlsx from 'xlsx';
import fs from 'fs';

export const getAllCandidates = async (req, res) => {
    try {
        const candidates = await candidateService.getAllCandidates();
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
};

export const getCandidateById = async (req, res) => {
    try {
        const candidate = await candidateService.getCandidateById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        // Get evaluation if exists
        const evaluation = await evaluationService.getEvaluationByCandidateId(req.params.id);
        res.json({ ...candidate, evaluation });
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({ error: 'Failed to fetch candidate' });
    }
};

export const createCandidate = async (req, res) => {
    try {
        const { name, experience_years, skills } = req.body;
        if (!name || !experience_years || !skills) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const candidate = await candidateService.createCandidate(req.body);
        res.status(201).json(candidate);
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ error: 'Failed to create candidate' });
    }
};

export const seedCandidates = async (req, res) => {
    try {
        const candidatesData = req.body;
        if (!Array.isArray(candidatesData) || candidatesData.length === 0) {
            return res.status(400).json({ error: 'Invalid candidates data' });
        }
        const result = await candidateService.bulkInsertCandidates(candidatesData);
        res.status(201).json({ message: `${result.affectedRows} candidates inserted` });
    } catch (error) {
        console.error('Error seeding candidates:', error);
        res.status(500).json({ error: 'Failed to seed candidates' });
    }
};

export const uploadCandidates = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        console.log('Processing uploaded file:', filePath);

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({ error: 'Excel file is empty' });
        }

        // Map data to candidate format
        const candidates = data.map(row => ({
            name: row.Name || row.name,
            experience_years: parseInt(row.Experience || row.ExperienceYears || row.experience_years) || 0,
            skills: row.Skills || row.skills || ''
        })).filter(c => c.name);

        if (candidates.length === 0) {
            return res.status(400).json({ error: 'No valid candidate data found in Excel' });
        }

        const result = await candidateService.bulkInsertCandidates(candidates);

        // Clean up temp file
        fs.unlinkSync(filePath);

        res.status(201).json({
            message: `Successfully imported ${result.affectedRows} candidates`,
            count: result.affectedRows
        });
    } catch (error) {
        console.error('Error uploading candidates:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to process Excel file' });
    }
};

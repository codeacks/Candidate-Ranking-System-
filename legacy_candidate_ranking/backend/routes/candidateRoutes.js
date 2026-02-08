import express from 'express';
import multer from 'multer';
import path from 'path';
import * as candidateController from '../controllers/candidateController.js';

const router = express.Router();

// Configure multer for temp storage
const upload = multer({ dest: 'uploads/' });

router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.post('/', candidateController.createCandidate);
router.post('/seed', candidateController.seedCandidates);
router.post('/upload', upload.single('file'), candidateController.uploadCandidates);

export default router;

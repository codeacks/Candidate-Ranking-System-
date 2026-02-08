import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Candidates
export const getCandidates = () => api.get('/candidates');
export const getCandidateById = (id) => api.get(`/candidates/${id}`);

// Evaluations
export const getEvaluations = () => api.get('/evaluations');
export const runEvaluations = () => api.post('/evaluations/run');

// Rankings
export const getRankings = () => api.get('/rankings');
export const getTopRankings = (limit = 10) => api.get(`/rankings/top?limit=${limit}`);
export const getSystemMetrics = () => api.get('/rankings/metrics');
export const recalculateRankings = () => api.post('/rankings/recalculate');

export default api;

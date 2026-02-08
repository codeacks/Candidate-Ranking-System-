# AI Candidate Ranking System 🚀

A premium AI-powered dashboard for **Recycling Production Line Managers** recruitment. This system evaluates candidates across critical industrial competencies using mock AI evaluations and advanced database triggers.

## ✨ Core Features
- **AI-Driven Evaluation**: Automatic scoring for Crisis Management, Sustainability, and Team Motivation.
- **Bulk Talent Import**: Support for `.xlsx` Excel rosters for high-speed recruitment scaling.
- **Premium Analytics**: Interactive skill heatmaps and performance leaderboard.
- **HR Workflow**: One-click "Share Candidate" functionality and detailed profile modals.
- **Optimized Persistence**: MySQL backend with indexed schemas and ranking triggers.

## 📂 Project Structure
- `/frontend`: React + Vite + Mantine (UI Layer)
- `/backend`: Node.js + Express + MySQL (API Layer)
- `AI_PROMPTS.md`: Detailed breakdown of evaluation schemas.
- `SAMPLE_DATA.sql`: Pre-populated database seed for testing.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server

### 2. Backend Setup
```bash
cd legacy_candidate_ranking/backend
npm install
# Configure .env with your DB credentials
# Create database using schema.sql
# Populate using SAMPLE_DATA.sql or let the app auto-seed
node index.js
```

### 3. Frontend Setup
```bash
cd legacy_candidate_ranking/frontend
npm install
npm run dev
```

## 📊 Evaluation Rubric
The AI evaluates candidates based on three core pillars:
1. **Crisis Management** (30%): Safety compliance, industrial emergency handling.
2. **Sustainability** (35%): Circular economy knowledge, waste reduction expertise.
3. **Team Motivation** (35%): Leadership performance and operational engagement.

---
*Created for the Recruitment Software Design Challenge.*

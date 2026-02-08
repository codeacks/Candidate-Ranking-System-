# AI Evaluation Prompts Summary

This document outlines the explicit prompts used by the AI Candidate Ranking System to evaluate candidates for the **Recycling Production Line Manager** role.

## 1. Crisis Management Evaluation
**Objective**: Assess the candidate's ability to handle industrial emergencies, equipment failures, and safety breaches.

> **Prompt**:
> "Evaluate the candidate's profile specifically for Crisis Management in a recycling plant environment. Focus on their experience with rapid response, resource reallocation during failure, and safety protocol enforcement. Generate a score out of 10.0 based on keywords like 'Safety Compliance', 'Crisis Management', and 'Process Optimization'."

## 2. Sustainability & Circular Economy
**Objective**: Determine the candidate's depth of knowledge regarding waste reduction and green energy integration.

> **Prompt**:
> "Analyze the candidate's 'Sustainability Knowledge' and 'Waste Recycling' experience. How well do they understand the circular economy and material lifecycle? Score them out of 10.0 considering their years of experience and specific skill matches in environmental operations."

## 3. Operational Team Motivation
**Objective**: Evaluate leadership capacity and the ability to maintain high morale in physically demanding production environments.

> **Prompt**:
> "Based on 'Team Leadership' and 'Lean Manufacturing' skills, evaluate the candidate's potential to motivate a diverse floor team. Focus on their ability to drive productivity through positive reinforcement and efficient workflow design. Return a leadership motivation score out of 10.0."

## Evaluation Rubric (Mock Implementation)
The current mock engine simulates these scores using the following logic:
- **Base Score**: derived from `experience_years` (mapped to 1-10 scale).
- **Skill Bonus**: +1.0 for each specific high-value skill match (e.g., 'Crisis Management').
- **Random Variance**: +/- 0.5 to simulate the nuance of an LLM's subjective evaluation.

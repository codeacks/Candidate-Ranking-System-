import { faker } from '@faker-js/faker';
import fs from 'fs';

const skillsList = [
    "Lean Manufacturing",
    "Waste Recycling",
    "Safety Compliance",
    "Team Leadership",
    "Process Optimization",
    "Quality Control",
    "Crisis Management",
    "Sustainability knowledge",
    "Logistics Management"
];

let data = [];

for (let i = 0; i < 40; i++) {
    data.push({
        name: faker.person.fullName(),
        experience_years: faker.number.int({ min: 2, max: 20 }),
        skills: faker.helpers.arrayElements(skillsList, { min: 3, max: 5 }).join(", ")
    });
}

fs.writeFileSync("candidates.json", JSON.stringify(data, null, 2));
console.log("40 candidates generated");

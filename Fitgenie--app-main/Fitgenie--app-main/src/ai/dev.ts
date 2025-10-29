
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-workout-plan.ts';
import '@/ai/flows/suggest-nutrition-alternatives.ts';
import '@/ai/flows/suggest-workout-modification.ts';
import '@/ai/flows/generate-nutrition-plan.ts';
import '@/ai/flows/generate-dashboard-image.ts';

'use server';
/**
 * @fileOverview A nutrition plan generation AI agent.
 *
 * - generateNutritionPlan - A function that handles the nutrition plan generation process.
 * - GenerateNutritionPlanInput - The input type for the generateNutritionPlan function.
 * - GenerateNutritionPlanOutput - The return type for the generateNutritionPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNutritionPlanInputSchema = z.object({
  dietaryRestrictions: z.string().describe('Any dietary restrictions the user has (e.g., vegetarian, vegan, gluten-free, allergies).'),
  preferences: z.string().describe('The user’s food preferences (e.g., favorite foods, cuisines).'),
  fitnessGoals: z.string().describe('The user’s fitness goals (e.g., weight loss, muscle gain, general health).'),
});
export type GenerateNutritionPlanInput = z.infer<typeof GenerateNutritionPlanInputSchema>;

const GenerateNutritionPlanOutputSchema = z.object({
  plan: z.string().describe('The generated nutrition plan, including meal suggestions and recipes.'),
});
export type GenerateNutritionPlanOutput = z.infer<typeof GenerateNutritionPlanOutputSchema>;

export async function generateNutritionPlan(input: GenerateNutritionPlanInput): Promise<GenerateNutritionPlanOutput> {
  return generateNutritionPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNutritionPlanPrompt',
  input: {schema: GenerateNutritionPlanInputSchema},
  output: {schema: GenerateNutritionPlanOutputSchema},
  prompt: `You are a personal nutrition assistant. Generate a personalized nutrition plan for the user, taking into account their dietary restrictions, preferences, and fitness goals. The output should be a detailed plan including meal suggestions and recipes.

Dietary Restrictions: {{{dietaryRestrictions}}}
Preferences: {{{preferences}}}
Fitness Goals: {{{fitnessGoals}}}

Nutrition Plan:`, // Ensure this is parsable
});

const generateNutritionPlanFlow = ai.defineFlow(
  {
    name: 'generateNutritionPlanFlow',
    inputSchema: GenerateNutritionPlanInputSchema,
    outputSchema: GenerateNutritionPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

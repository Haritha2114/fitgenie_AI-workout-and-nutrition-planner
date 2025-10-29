'use server';
/**
 * @fileOverview Workout plan generation AI agent.
 *
 * - generateWorkoutPlan - A function that handles the workout plan generation process.
 * - GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * - GenerateWorkoutPlanOutput - The return type for the generateWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkoutPlanInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('The fitness goals of the user (e.g., lose weight, build muscle, increase endurance).'),
  fitnessLevel: z
    .enum(['Beginner', 'Intermediate', 'Advanced'])
    .describe('The current fitness level of the user.'),
  availableEquipment: z
    .string()
    .describe('The equipment available to the user (e.g., dumbbells, barbell, resistance bands, no equipment).'),
  timeConstraints: z
    .string()
    .describe('The time constraints of the user (e.g., 30 minutes, 1 hour, 1.5 hours).'),
  workoutPreferences: z
    .string()
    .describe('The workout preferences of the user (e.g., cardio, strength training, yoga).'),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const GenerateWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('The generated workout plan.'),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are a personal trainer who helps users generate a workout plan based on their fitness goals, fitness level, available equipment and time constraints.

  Fitness Goals: {{{fitnessGoals}}}
  Fitness Level: {{{fitnessLevel}}}
  Available Equipment: {{{availableEquipment}}}
  Time Constraints: {{{timeConstraints}}}
  Workout Preferences: {{{workoutPreferences}}}

  Generate a workout plan based on the above information. The workout plan should be easy to follow and should include the number of sets and reps for each exercise.
  `,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

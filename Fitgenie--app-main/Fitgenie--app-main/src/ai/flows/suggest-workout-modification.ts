// src/ai/flows/suggest-workout-modification.ts
'use server';
/**
 * @fileOverview Provides workout modification suggestions based on constraints.
 *
 * - suggestWorkoutModification - A function that suggests workout modifications.
 * - SuggestWorkoutModificationInput - The input type for suggestWorkoutModification function.
 * - SuggestWorkoutModificationOutput - The return type for suggestWorkoutModification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWorkoutModificationInputSchema = z.object({
  exercise: z.string().describe('The exercise to be modified.'),
  equipmentAvailable: z.string().describe('The equipment available to the user.'),
  fitnessLevel: z.string().describe('The fitness level of the user (beginner, intermediate, advanced).'),
  workoutPlan: z.string().describe('The workout plan the exercise is part of.'),
  reasonForModification: z.string().describe('The reason the user cannot perform the exercise (e.g., injury, lack of equipment).'),
});
export type SuggestWorkoutModificationInput = z.infer<typeof SuggestWorkoutModificationInputSchema>;

const SuggestWorkoutModificationOutputSchema = z.object({
  modifiedExercise: z.string().describe('The suggested modified exercise.'),
  reasoning: z.string().describe('The AI reasoning behind the modification suggestion.'),
});
export type SuggestWorkoutModificationOutput = z.infer<typeof SuggestWorkoutModificationOutputSchema>;

export async function suggestWorkoutModification(input: SuggestWorkoutModificationInput): Promise<SuggestWorkoutModificationOutput> {
  return suggestWorkoutModificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWorkoutModificationPrompt',
  input: {schema: SuggestWorkoutModificationInputSchema},
  output: {schema: SuggestWorkoutModificationOutputSchema},
  prompt: `You are a personal trainer. A user is unable to perform the following exercise: {{{exercise}}}.
  They are following this workout plan: {{{workoutPlan}}}.
  The reason they cannot perform it is: {{{reasonForModification}}}.

  Considering they have the following equipment available: {{{equipmentAvailable}}} and their fitness level is: {{{fitnessLevel}}},
  suggest a modification to the exercise that they can perform. Explain your reasoning.

  The modified exercise should target the same muscle groups as the original exercise, while considering the user's constraints.
  If no modification is possible, suggest an alternative exercise that is possible given the user's constraints.
  `,
});

const suggestWorkoutModificationFlow = ai.defineFlow(
  {
    name: 'suggestWorkoutModificationFlow',
    inputSchema: SuggestWorkoutModificationInputSchema,
    outputSchema: SuggestWorkoutModificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

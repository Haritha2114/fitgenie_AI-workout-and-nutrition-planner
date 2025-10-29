'use server';
/**
 * @fileOverview An AI agent to suggest alternative meals or ingredients for a nutrition plan.
 *
 * - suggestNutritionAlternatives - A function that suggests alternative meals or ingredients.
 * - SuggestNutritionAlternativesInput - The input type for the suggestNutritionAlternatives function.
 * - SuggestNutritionAlternativesOutput - The return type for the suggestNutritionAlternatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNutritionAlternativesInputSchema = z.object({
  originalPlan: z
    .string()
    .describe('The original nutrition plan for which alternatives are needed.'),
  unavailableIngredients: z
    .string()
    .describe(
      'A comma-separated list of ingredients that are not available, or the meal to be replaced.'
    ),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe('Any dietary restrictions to consider, such as allergies or preferences.'),
});
export type SuggestNutritionAlternativesInput = z.infer<
  typeof SuggestNutritionAlternativesInputSchema
>;

const SuggestNutritionAlternativesOutputSchema = z.object({
  alternativeSuggestions: z
    .string()
    .describe(
      'A list of suggested alternative meals or ingredients, taking into account any dietary restrictions provided.'
    ),
});
export type SuggestNutritionAlternativesOutput = z.infer<
  typeof SuggestNutritionAlternativesOutputSchema
>;

export async function suggestNutritionAlternatives(
  input: SuggestNutritionAlternativesInput
): Promise<SuggestNutritionAlternativesOutput> {
  return suggestNutritionAlternativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNutritionAlternativesPrompt',
  input: {schema: SuggestNutritionAlternativesInputSchema},
  output: {schema: SuggestNutritionAlternativesOutputSchema},
  prompt: `You are a nutrition expert. A user has requested alternative suggestions for their nutrition plan.

  Original Plan: {{{originalPlan}}}
  Unavailable Ingredients/Meal to Replace: {{{unavailableIngredients}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}

  Suggest alternative meals or ingredients, taking into account any dietary restrictions provided.
  Return a clear and concise list of suggestions.
  `,
});

const suggestNutritionAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestNutritionAlternativesFlow',
    inputSchema: SuggestNutritionAlternativesInputSchema,
    outputSchema: SuggestNutritionAlternativesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

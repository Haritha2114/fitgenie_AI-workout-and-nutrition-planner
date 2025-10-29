
'use server';
/**
 * @fileOverview Generates an image for the dashboard.
 *
 * - generateDashboardImage - A function that generates an image based on a prompt.
 * - GenerateDashboardImageInput - The input type for the generateDashboardImage function.
 * - GenerateDashboardImageOutput - The return type for the generateDashboardImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDashboardImageInputSchema = z.object({
  prompt: z.string().describe('The prompt to use for image generation.'),
});
export type GenerateDashboardImageInput = z.infer<typeof GenerateDashboardImageInputSchema>;

const GenerateDashboardImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateDashboardImageOutput = z.infer<typeof GenerateDashboardImageOutputSchema>;

export async function generateDashboardImage(input: GenerateDashboardImageInput): Promise<GenerateDashboardImageOutput> {
  return generateDashboardImageFlow(input);
}

const generateDashboardImageFlow = ai.defineFlow(
  {
    name: 'generateDashboardImageFlow',
    inputSchema: GenerateDashboardImageInputSchema,
    outputSchema: GenerateDashboardImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        safetySettings: [ // Added to potentially allow more creative fitness imagery
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed or returned no media URL.');
    }
    return {imageDataUri: media.url};
  }
);

'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AppleIcon, Wand2 } from 'lucide-react';
import { generateNutritionPlan, type GenerateNutritionPlanInput } from '@/ai/flows/generate-nutrition-plan';
import { RawGeneratedNutritionPlan } from '@/lib/types';
import NutritionPlanDisplay from '@/components/nutrition/nutrition-plan-display';
import NutritionAlternativesDialog from '@/components/nutrition/nutrition-alternatives-dialog';


const nutritionPlanSchema = z.object({
  dietaryRestrictions: z.string().min(3, 'e.g., vegetarian, gluten-free, none.'),
  preferences: z.string().min(3, 'e.g., love chicken, dislike spicy food.'),
  fitnessGoals: z.string().min(5, 'e.g., weight loss, muscle gain, healthy eating.'),
});

type NutritionPlanFormValues = z.infer<typeof nutritionPlanSchema>;

export default function NutritionPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<RawGeneratedNutritionPlan | null>(null);
  const [showAlternativesDialog, setShowAlternativesDialog] = useState(false);
  const [itemToReplace, setItemToReplace] = useState<{ originalPlan: string; item: string } | null>(null);

  const form = useForm<NutritionPlanFormValues>({
    resolver: zodResolver(nutritionPlanSchema),
    defaultValues: {
      dietaryRestrictions: '',
      preferences: '',
      fitnessGoals: '',
    },
  });

  const onSubmit: SubmitHandler<NutritionPlanFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedPlan(null);
    try {
      const aiInput: GenerateNutritionPlanInput = data;
      const result = await generateNutritionPlan(aiInput);
      setGeneratedPlan(result);
      toast({
        title: 'Nutrition Plan Generated!',
        description: 'Your personalized nutrition plan is ready.',
      });
    } catch (error) {
      console.error('Error generating nutrition plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate nutrition plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAlternative = (originalPlan: string, item: string) => {
    setItemToReplace({ originalPlan, item });
    setShowAlternativesDialog(true);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <AppleIcon className="mr-2 h-6 w-6 text-primary" /> AI Nutrition Planner
          </CardTitle>
          <CardDescription>
            Share your dietary needs and goals, and let our AI create a delicious and effective nutrition plan for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="dietaryRestrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Restrictions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., vegetarian, gluten-free, allergies to nuts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Preferences</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., love Italian food, prefer quick meals, dislike fish" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness / Health Goals</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., lose 5kg, build lean muscle, maintain healthy weight" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Nutrition Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Crafting your nutrition plan...</p>
          </CardContent>
        </Card>
      )}

      {generatedPlan && (
        <NutritionPlanDisplay 
          plan={generatedPlan} 
          onRequestAlternative={handleRequestAlternative} 
          dietaryRestrictions={form.getValues('dietaryRestrictions')}
        />
      )}

      {itemToReplace && (
        <NutritionAlternativesDialog
          isOpen={showAlternativesDialog}
          onClose={() => {
            setShowAlternativesDialog(false);
            setItemToReplace(null);
          }}
          originalPlan={itemToReplace.originalPlan}
          itemToReplace={itemToReplace.item}
          dietaryRestrictions={form.getValues('dietaryRestrictions')}
        />
      )}
    </div>
  );
}

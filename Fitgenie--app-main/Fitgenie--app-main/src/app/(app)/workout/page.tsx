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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { generateWorkoutPlan, type GenerateWorkoutPlanInput } from '@/ai/flows/generate-workout-plan';
import { RawGeneratedWorkoutPlan } from '@/lib/types';
import WorkoutPlanDisplay from '@/components/workout/workout-plan-display';
import WorkoutModificationDialog from '@/components/workout/workout-modification-dialog';


const workoutPlanSchema = z.object({
  fitnessGoals: z.string().min(10, 'Please describe your fitness goals in more detail.'),
  fitnessLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  availableEquipment: z.string().min(3, 'List available equipment or "bodyweight".'),
  timeConstraints: z.string().min(3, 'e.g., "30 minutes", "1 hour per session"'),
  workoutPreferences: z.string().optional(),
});

type WorkoutPlanFormValues = z.infer<typeof workoutPlanSchema>;

export default function WorkoutPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<RawGeneratedWorkoutPlan | null>(null);
  const [showModificationDialog, setShowModificationDialog] = useState(false);
  const [exerciseToModify, setExerciseToModify] = useState<{ exercise: string; currentPlan: string } | null>(null);


  const form = useForm<WorkoutPlanFormValues>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      fitnessGoals: '',
      fitnessLevel: 'Beginner',
      availableEquipment: '',
      timeConstraints: '',
      workoutPreferences: '',
    },
  });

  const onSubmit: SubmitHandler<WorkoutPlanFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedPlan(null);
    try {
      const aiInput: GenerateWorkoutPlanInput = {
        ...data,
        workoutPreferences: data.workoutPreferences || 'Any',
      };
      const result = await generateWorkoutPlan(aiInput);
      setGeneratedPlan(result);
      toast({
        title: 'Workout Plan Generated!',
        description: 'Your personalized workout plan is ready.',
      });
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate workout plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRequestModification = (exercise: string, currentPlan: string) => {
    setExerciseToModify({ exercise, currentPlan });
    setShowModificationDialog(true);
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Wand2 className="mr-2 h-6 w-6 text-primary" /> AI Workout Planner
          </CardTitle>
          <CardDescription>
            Tell us about your goals and preferences, and our AI will craft a personalized workout plan for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., lose weight, build muscle, improve cardio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fitnessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your fitness level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeConstraints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Constraints</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 30 mins daily, 3x a week 1hr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="availableEquipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Equipment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., dumbbells, resistance bands, bodyweight only" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workoutPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workout Preferences (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., prefer HIIT, dislike running, enjoy yoga" {...field} />
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
                Generate Workout Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Generating your workout plan...</p>
          </CardContent>
        </Card>
      )}

      {generatedPlan && (
         <WorkoutPlanDisplay 
            plan={generatedPlan} 
            onRequestModification={handleRequestModification}
            fitnessLevel={form.getValues('fitnessLevel')}
            availableEquipment={form.getValues('availableEquipment')}
          />
      )}

      {exerciseToModify && (
        <WorkoutModificationDialog
          isOpen={showModificationDialog}
          onClose={() => {
            setShowModificationDialog(false);
            setExerciseToModify(null);
          }}
          exerciseName={exerciseToModify.exercise}
          currentWorkoutPlan={exerciseToModify.currentPlan}
          fitnessLevel={form.getValues('fitnessLevel')}
          availableEquipment={form.getValues('availableEquipment')}
        />
      )}
    </div>
  );
}

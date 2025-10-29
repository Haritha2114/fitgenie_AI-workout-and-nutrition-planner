'use client';

import { RawGeneratedWorkoutPlan, WorkoutDay, WorkoutExercise } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';

interface WorkoutPlanDisplayProps {
  plan: RawGeneratedWorkoutPlan;
  onRequestModification: (exerciseName: string, currentPlan: string) => void;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availableEquipment: string;
}

// Basic parser for the AI string output. This is a placeholder and might need to be very robust.
// It assumes a structure like:
// Title: My Workout Plan
// Description: A plan for...
// Day 1: Upper Body
//   Exercise 1: Push-ups - 3 sets of 10 reps
//   Exercise 2: Pull-ups - 3 sets of AMRAP
// Day 2: Lower Body
//   ...
function parseWorkoutPlan(planString: string): { title: string; description?: string; days: WorkoutDay[] } {
  const lines = planString.split('\n').filter(line => line.trim() !== '');
  let title = "Workout Plan";
  let description: string | undefined = undefined;
  const days: WorkoutDay[] = [];
  let currentDay: WorkoutDay | null = null;
  let currentExercise: WorkoutExercise | null = null;

  if (lines.length > 0 && lines[0].toLowerCase().startsWith("title:")) {
    title = lines.shift()!.substring(6).trim();
  }
  if (lines.length > 0 && lines[0].toLowerCase().startsWith("description:")) {
    description = lines.shift()!.substring(12).trim();
  }
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.match(/^(Day \d+|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Week \d+ Day \d+)/i)) {
      if (currentDay) days.push(currentDay);
      const parts = trimmedLine.split(':');
      currentDay = { day: parts[0].trim(), focus: parts[1]?.trim(), exercises: [] };
    } else if (currentDay && (trimmedLine.match(/^\d+\./) || trimmedLine.match(/^- /) || trimmedLine.toLowerCase().startsWith("exercise"))) { // Exercise line
      // Example: "Push-ups - 3 sets of 10-12 reps (Rest 60s)"
      // Example: "1. Squats: 3 sets x 8-12 reps"
      const exerciseParts = trimmedLine.replace(/^\d+\.\s*/, '').replace(/^- \s*/, '').split(/[:\-]/);
      const name = exerciseParts[0].trim();
      const details = exerciseParts.slice(1).join(':').trim();
      
      let sets, reps, duration, rest;
      
      const setsMatch = details.match(/(\d+)\s*sets?/i);
      if (setsMatch) sets = parseInt(setsMatch[1]);
      
      const repsMatch = details.match(/(\d+(?:-\d+)?|AMRAP|As many reps as possible)\s*reps?/i);
      if (repsMatch) reps = repsMatch[1];

      const durationMatch = details.match(/(\d+\s*(seconds|sec|minutes|min))/i);
      if (durationMatch) duration = durationMatch[1];

      const restMatch = details.match(/(?:Rest|rest)\s*(\d+\s*(seconds|sec|minutes|min))/i);
      if (restMatch) rest = restMatch[1];

      currentExercise = { name, sets, reps, duration, rest, notes: details };
      currentDay.exercises.push(currentExercise);
    } else if (currentDay && currentExercise && (trimmedLine.toLowerCase().startsWith("notes:") || trimmedLine.toLowerCase().startsWith("details:"))) {
        currentExercise.notes = (currentExercise.notes ? currentExercise.notes + "; " : "") + trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
    }
  });
  if (currentDay) days.push(currentDay);

  if (days.length === 0 && lines.length > 0) { // Fallback if no days parsed but content exists
    days.push({ day: "Full Plan", exercises: lines.map(line => ({ name: line.trim()})) });
  }

  return { title, description, days };
}


export default function WorkoutPlanDisplay({ plan, onRequestModification, fitnessLevel, availableEquipment }: WorkoutPlanDisplayProps) {
  if (!plan || !plan.workoutPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Plan Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Generate a workout plan to see it here.</p>
        </CardContent>
      </Card>
    );
  }

  const parsedPlan = parseWorkoutPlan(plan.workoutPlan);
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-primary">{parsedPlan.title || 'Your Workout Plan'}</CardTitle>
        {parsedPlan.description && <CardDescription>{parsedPlan.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {parsedPlan.days.length > 0 ? (
          <Accordion type="single" collapsible className="w-full" defaultValue={parsedPlan.days[0]?.day}>
            {parsedPlan.days.map((day, dayIndex) => (
              <AccordionItem value={day.day || `day-${dayIndex}`} key={day.day || `day-${dayIndex}`}>
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  {day.day} {day.focus ? ` - ${day.focus}` : ''}
                </AccordionTrigger>
                <AccordionContent>
                  {day.warmUp && <p className="italic text-sm text-muted-foreground mb-2"><strong>Warm-up:</strong> {day.warmUp}</p>}
                  <ul className="space-y-3">
                    {day.exercises.map((exercise, exIndex) => (
                      <li key={exIndex} className="p-3 bg-muted/50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-md">{exercise.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {exercise.sets && `${exercise.sets} sets`}
                              {exercise.sets && exercise.reps && ' of '}
                              {exercise.reps && `${exercise.reps} reps`}
                              {exercise.duration && ` for ${exercise.duration}`}
                              {exercise.rest && ` (Rest: ${exercise.rest})`}
                            </p>
                            {exercise.notes && !exercise.notes.includes(exercise.name) && ( // Avoid redundant notes
                                <p className="text-xs italic text-muted-foreground mt-1">Notes: {exercise.notes.replace(/(\d+ sets? of \d+(-?\d+)? reps?)|(AMRAP reps?)|(Rest \w+)/gi, '').trim()}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRequestModification(exercise.name, plan.workoutPlan)}
                            className="ml-2 text-primary hover:text-primary/80"
                            aria-label={`Modify ${exercise.name}`}
                          >
                            <Edit3 className="h-4 w-4 mr-1 group-hover:hidden" />
                             <span className="hidden group-hover:inline">Modify</span>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {day.coolDown && <p className="italic text-sm text-muted-foreground mt-2"><strong>Cool-down:</strong> {day.coolDown}</p>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{plan.workoutPlan}</pre>
        )}
      </CardContent>
    </Card>
  );
}

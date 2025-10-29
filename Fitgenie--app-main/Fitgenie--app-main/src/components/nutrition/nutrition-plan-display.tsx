
'use client';

import { RawGeneratedNutritionPlan, NutritionDay, Meal } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CookingPot, Edit3, Share2, Save, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

interface NutritionPlanDisplayProps {
  plan: RawGeneratedNutritionPlan;
  onRequestAlternative?: (originalPlan: string, item: string) => void; // Made optional
  dietaryRestrictions: string;
  onPlanCleared?: () => void; // For saved plan page to re-render
  isSavedPlanPage?: boolean; // To conditionally show "Clear Plan"
}

// Basic parser for the AI string output for nutrition plans.
// This is a placeholder and might need to be robust.
// Assumes structure like:
// Title: My Nutrition Plan
// Description: Healthy eating for...
// Day 1:
//   Breakfast: Oatmeal with berries - Recipe: ... Macros: C:300 P:10 F:5
//   Lunch: Chicken Salad - Recipe: ... Macros: C:400 P:30 F:15
// Day 2:
// ...
function parseNutritionPlan(planString: string): { title: string; description?: string; days: NutritionDay[] } {
  const lines = planString.split('\n').filter(line => line.trim() !== '');
  let title = "Nutrition Plan";
  let description: string | undefined = undefined;
  const days: NutritionDay[] = [];
  let currentDay: NutritionDay | null = null;

  if (lines.length > 0 && lines[0].toLowerCase().startsWith("title:")) {
    title = lines.shift()!.substring(6).trim();
  }
  if (lines.length > 0 && lines[0].toLowerCase().startsWith("description:")) {
    description = lines.shift()!.substring(12).trim();
  }

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.match(/^(Day \d+|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i)) {
      if (currentDay) days.push(currentDay);
      currentDay = { day: trimmedLine.replace(':','').trim(), meals: [] };
    } else if (currentDay && (trimmedLine.toLowerCase().startsWith("breakfast:") || trimmedLine.toLowerCase().startsWith("lunch:") || trimmedLine.toLowerCase().startsWith("dinner:") || trimmedLine.toLowerCase().startsWith("snack:"))) {
      const mealType = trimmedLine.substring(0, trimmedLine.indexOf(':')).trim();
      let mealDescription = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
      
      let recipe: string | undefined;
      let macros: Meal['macros'] | undefined;

      const recipeMatch = mealDescription.match(/Recipe:\s*(.*?)(?=\s*Macros:|$)/i);
      if (recipeMatch) {
        recipe = recipeMatch[1].trim();
        mealDescription = mealDescription.replace(recipeMatch[0], '').trim();
      }

      const macrosMatch = mealDescription.match(/Macros:\s*(.*)/i);
      if (macrosMatch) {
        macros = {};
        const macroString = macrosMatch[1].trim();
        mealDescription = mealDescription.replace(macrosMatch[0], '').trim();
        
        const calMatch = macroString.match(/Calories:\s*(\d+)|C:\s*(\d+)/i);
        if (calMatch) macros.calories = parseInt(calMatch[1] || calMatch[2]);
        const proMatch = macroString.match(/Protein:\s*(\d+g?)|P:\s*(\d+g?)/i);
        if (proMatch) macros.protein = parseInt(proMatch[1] || proMatch[2]);
        const carbMatch = macroString.match(/Carbs:\s*(\d+g?)|Carbohydrates:\s*(\d+g?)/i);
        if (carbMatch) macros.carbs = parseInt(carbMatch[1] || carbMatch[2]);
        const fatMatch = macroString.match(/Fat:\s*(\d+g?)|F:\s*(\d+g?)/i);
        if (fatMatch) macros.fat = parseInt(fatMatch[1] || fatMatch[2]);
      }
      
      currentDay.meals.push({ name: mealType, description: mealDescription.trim(), recipe, macros });
    } else if (currentDay && currentDay.meals.length > 0 && !trimmedLine.match(/^(Day \d+|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i) ) {
        // If line is not a new day or a new meal type, append it to the description of the last meal
        const lastMeal = currentDay.meals[currentDay.meals.length - 1];
        lastMeal.description += `\n${trimmedLine}`;
    }
  });
  if (currentDay) days.push(currentDay);

  if (days.length === 0 && lines.length > 0) { // Fallback if no days parsed but content exists
    days.push({ day: "Full Plan", meals: lines.map(line => ({ name: "Meal", description: line.trim()})) });
  }
  return { title, description, days };
}


export default function NutritionPlanDisplay({ plan, onRequestAlternative, dietaryRestrictions, onPlanCleared, isSavedPlanPage = false }: NutritionPlanDisplayProps) {
  const { toast } = useToast();

  if (!plan || !plan.plan) {
    return (
      <Card>
        <CardHeader><CardTitle>No Plan Available</CardTitle></CardHeader>
        <CardContent><p>Generate or load a nutrition plan to see it here.</p></CardContent>
      </Card>
    );
  }
  
  const parsedPlan = parseNutritionPlan(plan.plan);

  const handleSaveRecipe = (meal: Meal) => {
    // Mock save functionality for individual meal
    toast({
      title: "Recipe Saved (Mock)",
      description: `${meal.name}: ${meal.description.split('\n')[0]} has been saved.`,
    });
    console.log("Saving meal:", meal);
  };

  const handleShareRecipe = async (meal: Meal) => {
    const shareData = {
      title: `FitGenie Recipe: ${meal.name}`,
      text: `Check out this recipe from my FitGenie nutrition plan:\n${meal.name}: ${meal.description}\n${meal.recipe ? 'Recipe: ' + meal.recipe : ''}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Recipe Shared!",
          description: "The recipe has been shared using your device's share dialog.",
        });
      } else {
        navigator.clipboard.writeText(shareData.text);
        toast({
          title: "Recipe Copied!",
          description: "Sharing not supported, recipe details copied to clipboard.",
        });
      }
    } catch (err) {
      console.error("Share failed:", err);
      toast({
        title: "Share Failed",
        description: "Could not share the recipe at this time.",
        variant: "destructive",
      });
    }
  };

  const handleSaveFullPlan = () => {
    try {
      const planToSave = {
        plan: plan.plan, // The raw plan string
        dietaryRestrictions: dietaryRestrictions,
      };
      localStorage.setItem('fitgenie-saved-nutrition-plan', JSON.stringify(planToSave));
      toast({
        title: "Nutrition Plan Saved!",
        description: "Your nutrition plan has been saved to your browser's local storage.",
      });
    } catch (error) {
      console.error("Error saving plan to local storage:", error);
      toast({
        title: "Save Failed",
        description: "Could not save the nutrition plan. Local storage might be full or unavailable.",
        variant: "destructive",
      });
    }
  };

  const handleClearFullPlan = () => {
    try {
      localStorage.removeItem('fitgenie-saved-nutrition-plan');
      toast({
        title: "Saved Plan Cleared",
        description: "Your saved nutrition plan has been removed from local storage.",
      });
      if (onPlanCleared) {
        onPlanCleared();
      }
    } catch (error)
    {
      console.error("Error clearing plan from local storage:", error);
      toast({
        title: "Clearing Failed",
        description: "Could not clear the saved nutrition plan.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-primary">{parsedPlan.title || 'Your Nutrition Plan'}</CardTitle>
        {parsedPlan.description && <CardDescription>{parsedPlan.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {parsedPlan.days.length > 0 ? (
          <Accordion type="single" collapsible className="w-full" defaultValue={parsedPlan.days[0]?.day}>
            {parsedPlan.days.map((day, dayIndex) => (
              <AccordionItem value={day.day || `day-${dayIndex}`} key={day.day || `day-${dayIndex}`}>
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">{day.day}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {day.meals.map((meal, mealIndex) => (
                      <Card key={mealIndex} className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-md flex items-center">
                              <CookingPot className="h-5 w-5 mr-2 text-secondary" />
                              {meal.name}: {meal.description.split('\n')[0]}
                            </CardTitle>
                            {onRequestAlternative && ( // Conditionally render button
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRequestAlternative(plan.plan, `${meal.name}: ${meal.description.split('\n')[0]}`)}
                                className="text-primary hover:text-primary/80"
                                aria-label={`Get alternatives for ${meal.name}`}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1">
                          <p className="whitespace-pre-line">{meal.description}</p>
                          {meal.recipe && <p><strong>Recipe:</strong> {meal.recipe}</p>}
                          {meal.macros && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {meal.macros.calories && <Badge variant="outline">Calories: {meal.macros.calories}</Badge>}
                              {meal.macros.protein && <Badge variant="outline">Protein: {meal.macros.protein}g</Badge>}
                              {meal.macros.carbs && <Badge variant="outline">Carbs: {meal.macros.carbs}g</Badge>}
                              {meal.macros.fat && <Badge variant="outline">Fat: {meal.macros.fat}g</Badge>}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleSaveRecipe(meal)}><Save className="h-3 w-3 mr-1"/> Save Recipe (Mock)</Button>
                            <Button variant="outline" size="sm" onClick={() => handleShareRecipe(meal)}><Share2 className="h-3 w-3 mr-1"/> Share Recipe</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
           <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{plan.plan}</pre>
        )}
      </CardContent>
      <CardFooter>
        {isSavedPlanPage ? (
          <Button variant="destructive" onClick={handleClearFullPlan} className="w-full sm:w-auto">
            <Trash2 className="mr-2 h-4 w-4" /> Clear Saved Plan
          </Button>
        ) : (
          <Button onClick={handleSaveFullPlan} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" /> Save Full Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bookmark, Info } from 'lucide-react';
import NutritionPlanDisplay from '@/components/nutrition/nutrition-plan-display';
import { RawGeneratedNutritionPlan } from '@/lib/types';
import Link from 'next/link';

interface SavedPlanData {
  plan: string; // Raw plan string
  dietaryRestrictions: string;
}

export default function SavedPlanPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [savedData, setSavedData] = useState<SavedPlanData | null>(null);

  const loadSavedPlan = () => {
    setIsLoading(true);
    try {
      const storedData = localStorage.getItem('fitgenie-saved-nutrition-plan');
      if (storedData) {
        const parsedData: SavedPlanData = JSON.parse(storedData);
        setSavedData(parsedData);
      } else {
        setSavedData(null);
      }
    } catch (error) {
      console.error('Error loading saved plan from local storage:', error);
      toast({
        title: 'Error Loading Plan',
        description: 'Could not retrieve your saved plan.',
        variant: 'destructive',
      });
      setSavedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedPlan();
  }, []);


  const handlePlanCleared = () => {
    setSavedData(null); // Update state to reflect cleared plan
    // Toast is handled by NutritionPlanDisplay
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Bookmark className="mr-2 h-6 w-6 text-primary" /> Saved Nutrition Plan
          </CardTitle>
          <CardDescription>
            View your saved nutrition plan. Currently, only one plan can be saved at a time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading your saved plan...</p>
            </div>
          )}

          {!isLoading && !savedData && (
            <div className="text-center py-10">
              <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">No Saved Plan Found</p>
              <p className="text-muted-foreground mb-6">
                You haven't saved any nutrition plans yet. Go to the Nutrition page to generate and save one.
              </p>
              <Button asChild>
                <Link href="/nutrition">Go to Nutrition Planner</Link>
              </Button>
            </div>
          )}

          {!isLoading && savedData && (
            <NutritionPlanDisplay
              plan={{ plan: savedData.plan }} // Wrap raw string in RawGeneratedNutritionPlan structure
              dietaryRestrictions={savedData.dietaryRestrictions}
              isSavedPlanPage={true}
              onPlanCleared={handlePlanCleared}
              // onRequestAlternative is omitted, so the "Get Alternative" button won't show for meals
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

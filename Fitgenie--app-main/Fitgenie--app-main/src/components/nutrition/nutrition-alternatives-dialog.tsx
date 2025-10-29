'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Changed from Textarea for brevity of unavailable item
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { suggestNutritionAlternatives, type SuggestNutritionAlternativesInput } from '@/ai/flows/suggest-nutrition-alternatives';
import { RawNutritionAlternatives } from '@/lib/types';
import { Card, CardContent } from '../ui/card';

interface NutritionAlternativesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  originalPlan: string; // The full nutrition plan string for context
  itemToReplace: string; // The specific meal or ingredient string
  dietaryRestrictions: string; // User's current dietary restrictions
}

export default function NutritionAlternativesDialog({
  isOpen,
  onClose,
  originalPlan,
  itemToReplace,
  dietaryRestrictions,
}: NutritionAlternativesDialogProps) {
  const { toast } = useToast();
  const [customUnavailableItem, setCustomUnavailableItem] = useState(itemToReplace); // Pre-fill with item or allow custom input
  const [customDietaryRestrictions, setCustomDietaryRestrictions] = useState(dietaryRestrictions);
  const [isLoading, setIsLoading] = useState(false);
  const [alternativeSuggestion, setAlternativeSuggestion] = useState<RawNutritionAlternatives | null>(null);

  const handleSubmit = async () => {
    if (!customUnavailableItem.trim()) {
      toast({
        title: 'Item Required',
        description: 'Please specify the meal or ingredient you want to replace.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setAlternativeSuggestion(null);
    try {
      const input: SuggestNutritionAlternativesInput = {
        originalPlan: originalPlan,
        unavailableIngredients: customUnavailableItem,
        dietaryRestrictions: customDietaryRestrictions || undefined, // Pass if exists
      };
      const result = await suggestNutritionAlternatives(input);
      setAlternativeSuggestion(result);
      toast({
        title: 'Alternatives Suggested!',
        description: `AI has suggested alternatives for ${customUnavailableItem}.`,
      });
    } catch (error) {
      console.error('Error suggesting nutrition alternatives:', error);
      toast({
        title: 'Error',
        description: 'Failed to suggest alternatives. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    // Reset state if needed, or rely on initial props for next open
    setCustomUnavailableItem(itemToReplace);
    setCustomDietaryRestrictions(dietaryRestrictions);
    setAlternativeSuggestion(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Get Alternatives for: {itemToReplace}</DialogTitle>
          <DialogDescription>
            Specify the meal/ingredient and any additional restrictions for AI-powered alternatives.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="unavailableItem">Meal/Ingredient to Replace</Label>
            <Input
              id="unavailableItem"
              value={customUnavailableItem}
              onChange={(e) => setCustomUnavailableItem(e.target.value)}
              placeholder="e.g., Chicken breast, Oatmeal breakfast"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customRestrictions">Additional Dietary Restrictions (Optional)</Label>
            <Input
              id="customRestrictions"
              value={customDietaryRestrictions}
              onChange={(e) => setCustomDietaryRestrictions(e.target.value)}
              placeholder="e.g., No dairy, low-carb (uses plan default if empty)"
            />
          </div>

          {isLoading && (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Finding alternatives...</p>
            </div>
          )}

          {alternativeSuggestion && (
            <Card className="bg-muted/50 max-h-60 overflow-y-auto">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-1">Suggested Alternatives:</h4>
                <pre className="text-sm whitespace-pre-wrap">{alternativeSuggestion.alternativeSuggestions}</pre>
              </CardContent>
            </Card>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Get Alternatives
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

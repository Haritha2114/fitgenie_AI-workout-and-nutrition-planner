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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { suggestWorkoutModification, type SuggestWorkoutModificationInput } from '@/ai/flows/suggest-workout-modification';
import { RawWorkoutModification } from '@/lib/types';
import { Card, CardContent } from '../ui/card';

interface WorkoutModificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  currentWorkoutPlan: string;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availableEquipment: string;
}

export default function WorkoutModificationDialog({
  isOpen,
  onClose,
  exerciseName,
  currentWorkoutPlan,
  fitnessLevel,
  availableEquipment,
}: WorkoutModificationDialogProps) {
  const { toast } = useToast();
  const [reasonForModification, setReasonForModification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modificationSuggestion, setModificationSuggestion] = useState<RawWorkoutModification | null>(null);

  const handleSubmit = async () => {
    if (!reasonForModification.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for needing a modification.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setModificationSuggestion(null);
    try {
      const input: SuggestWorkoutModificationInput = {
        exercise: exerciseName,
        equipmentAvailable: availableEquipment,
        fitnessLevel: fitnessLevel,
        workoutPlan: currentWorkoutPlan, // Provide context of the whole plan
        reasonForModification: reasonForModification,
      };
      const result = await suggestWorkoutModification(input);
      setModificationSuggestion(result);
      toast({
        title: 'Modification Suggested!',
        description: `AI has suggested a modification for ${exerciseName}.`,
      });
    } catch (error) {
      console.error('Error suggesting workout modification:', error);
      toast({
        title: 'Error',
        description: 'Failed to suggest modification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setReasonForModification('');
    setModificationSuggestion(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modify Exercise: {exerciseName}</DialogTitle>
          <DialogDescription>
            Tell us why you need to modify this exercise, and our AI will suggest an alternative.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Modification</Label>
            <Textarea
              id="reason"
              value={reasonForModification}
              onChange={(e) => setReasonForModification(e.target.value)}
              placeholder="e.g., I have a shoulder injury, I don't have a pull-up bar."
              className="min-h-[100px]"
            />
          </div>

          {isLoading && (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Getting suggestion...</p>
            </div>
          )}

          {modificationSuggestion && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-1">Suggested Modification:</h4>
                <p className="text-sm mb-2">{modificationSuggestion.modifiedExercise}</p>
                <h4 className="font-semibold mb-1">Reasoning:</h4>
                <p className="text-xs italic">{modificationSuggestion.reasoning}</p>
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
            Get Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

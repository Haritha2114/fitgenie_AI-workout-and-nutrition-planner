
export type FitnessMetrics = {
  weight?: number; // in kg
  reps?: Record<string, number>; // e.g., { "Bench Press": 10 }
  // Add other metrics as needed
};

export type JournalEntry = {
  id: string;
  date: string; // ISO date string
  content: string;
};

export type UserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
  fitnessMetrics: FitnessMetrics;
  photos: string[]; // URLs of uploaded photos
  journalEntries: JournalEntry[];
  steps?: number; // Daily steps
};

export type WorkoutExercise = {
  name: string;
  sets?: number;
  reps?: string | number; // Can be "AMRAP" or a number
  duration?: string; // e.g., "30s"
  rest?: string; // e.g., "60s"
  notes?: string;
};

export type WorkoutDay = {
  day: string; // e.g., "Monday" or "Day 1"
  focus?: string; // e.g., "Upper Body"
  exercises: WorkoutExercise[];
  warmUp?: string;
  coolDown?: string;
};

export type GeneratedWorkoutPlan = {
  title: string;
  description?: string;
  days: WorkoutDay[];
};

export type Meal = {
  name: string; // e.g., "Breakfast", "Lunch", "Dinner", "Snack"
  description: string;
  recipe?: string;
  macros?: {
    calories?: number;
    protein?: number; // in grams
    carbs?: number; // in grams
    fat?: number; // in grams
  };
};

export type NutritionDay = {
  day: string; // e.g., "Monday" or "Day 1"
  meals: Meal[];
  dailyTotals?: Meal['macros'];
};

export type GeneratedNutritionPlan = {
  title: string;
  description?: string;
  days: NutritionDay[];
};

// AI Flow Inputs/Outputs (raw strings from current flows)
// These can be parsed into the structured types above

export interface RawGeneratedWorkoutPlan {
  workoutPlan: string; // The string AI output
}

export interface RawGeneratedNutritionPlan {
  plan: string; // The string AI output
}

export interface RawNutritionAlternatives {
  alternativeSuggestions: string;
}

export interface RawWorkoutModification {
  modifiedExercise: string;
  reasoning: string;
}

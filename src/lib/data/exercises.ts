// ⚡ SURGEFIT ENTERPRISE EXERCISE DATABASE
// Complete Animated GIF library (60+ Exercises) from https://github.com/omercotkd/exercises-gifs

import { FULL_ENTERPRISE_EXERCISES, ExerciseItem } from "../backend/exerciseDb";

export type { ExerciseItem };
export const EXERCISE_DATABASE: ExerciseItem[] = FULL_ENTERPRISE_EXERCISES;

export interface MealItem {
  id: string;
  name: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Post-Workout";
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  ingredients: string[];
}

export const DIET_TEMPLATES: MealItem[] = [
  {
    id: "meal_anabolic_oats",
    name: "Anabolic Whey & Berry Oats",
    mealType: "Breakfast",
    calories: 520,
    proteinGrams: 42,
    carbsGrams: 65,
    fatGrams: 10,
    ingredients: ["80g Rolled Oats", "1 Scoop Whey Isolate", "100g Blueberry", "15g Almond Butter"]
  },
  {
    id: "meal_chicken_rice_bowl",
    name: "Grilled Chicken Jasmine Rice Fuel",
    mealType: "Lunch",
    calories: 640,
    proteinGrams: 55,
    carbsGrams: 72,
    fatGrams: 12,
    ingredients: ["200g Chicken Breast", "180g Jasmine Rice", "100g Steamed Broccoli", "10ml Extra Virgin Olive Oil"]
  },
  {
    id: "meal_steak_sweet_potato",
    name: "Sirloin Steak & Roasted Sweet Potato",
    mealType: "Dinner",
    calories: 710,
    proteinGrams: 62,
    carbsGrams: 55,
    fatGrams: 22,
    ingredients: ["220g Grass-fed Sirloin", "200g Roasted Sweet Potato", "Asparagus Spears"]
  },
  {
    id: "meal_greek_yogurt_honey",
    name: "High-Protein Greek Yogurt Parfait",
    mealType: "Post-Workout",
    calories: 340,
    proteinGrams: 30,
    carbsGrams: 42,
    fatGrams: 4,
    ingredients: ["250g 0% Fat Greek Yogurt", "20g Honey", "30g Granola"]
  }
];

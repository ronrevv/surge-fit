// ⚡ SURGEFIT EXERCISE DATABASE & GIF ANIMATION LIBRARY
// Powered by raw GitHub exercise animation dataset: https://github.com/omercotkd/exercises-gifs

export interface ExerciseItem {
  id: string;
  name: string;
  category: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Cardio";
  equipment: "Barbell" | "Dumbbell" | "Cable" | "Machine" | "Bodyweight" | "Kettlebell";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  gifUrl: string;
  instructions: string[];
  targetMuscles: string[];
}

export const EXERCISE_DATABASE: ExerciseItem[] = [
  {
    id: "ex_barbell_squat",
    name: "Barbell Back Squat",
    category: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg",
    instructions: [
      "Position barbell across upper trapezius muscles.",
      "Brace core, push hips back and descend until thighs are parallel to ground.",
      "Drive through heels to return to starting position."
    ],
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"]
  },
  {
    id: "ex_incline_db_press",
    name: "Incline Dumbbell Bench Press",
    category: "Chest",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg",
    instructions: [
      "Adjust bench to 30-45 degree incline angle.",
      "Press dumbbells upward directly over upper chest with controlled tempo.",
      "Lower dumbbells until elbows reach 90 degrees."
    ],
    targetMuscles: ["Upper Pectoralis", "Anterior Deltoids", "Triceps"]
  },
  {
    id: "ex_lat_pulldown",
    name: "Wide-Grip Lat Pulldown",
    category: "Back",
    equipment: "Cable",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg",
    instructions: [
      "Grasp bar wider than shoulder width.",
      "Depress shoulder blades and pull bar to upper chest.",
      "Squeeze lats at the bottom before slow return."
    ],
    targetMuscles: ["Latissimus Dorsi", "Rhomboids", "Biceps"]
  },
  {
    id: "ex_db_shoulder_press",
    name: "Seated Dumbbell Shoulder Press",
    category: "Shoulders",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/0.jpg",
    instructions: [
      "Sit upright with back supported.",
      "Press dumbbells overhead until arms are nearly fully extended.",
      "Lower to ear level with controlled eccentric motion."
    ],
    targetMuscles: ["Anterior Deltoids", "Lateral Deltoids", "Triceps"]
  },
  {
    id: "ex_barbell_deadlift",
    name: "Conventional Barbell Deadlift",
    category: "Back",
    equipment: "Barbell",
    difficulty: "Advanced",
    gifUrl: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg",
    instructions: [
      "Stand with feet hip-width under bar.",
      "Grasp bar, pull chest up, brace core.",
      "Drive floor away with legs and lock out hips."
    ],
    targetMuscles: ["Erector Spinae", "Glutes", "Hamstrings", "Trapezius"]
  },
  {
    id: "ex_cable_tricep_pushdown",
    name: "Rope Cable Tricep Pushdown",
    category: "Arms",
    equipment: "Cable",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Triceps_Pushdown/0.jpg",
    instructions: [
      "Attach rope to high cable pulley.",
      "Keep elbows pinned to torso, extend arms downward.",
      "Spread rope ends apart at peak contraction."
    ],
    targetMuscles: ["Triceps Lateral Head", "Triceps Long Head"]
  },
  {
    id: "ex_barbell_bicep_curl",
    name: "Barbell Bicep Curl",
    category: "Arms",
    equipment: "Barbell",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg",
    instructions: [
      "Grasp barbell with underhand grip shoulder-width apart.",
      "Curl bar upward while keeping upper arms stationary.",
      "Squeeze biceps at peak contraction before lowering."
    ],
    targetMuscles: ["Biceps Brachii", "Brachialis"]
  },
  {
    id: "ex_hanging_leg_raise",
    name: "Hanging Leg Raise",
    category: "Core",
    equipment: "Bodyweight",
    difficulty: "Advanced",
    gifUrl: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/0.jpg",
    instructions: [
      "Hang from pull-up bar with overhand grip.",
      "Raise legs to 90 degrees without swinging momentum.",
      "Lower slowly under full abdominal control."
    ],
    targetMuscles: ["Lower Rectus Abdominis", "Hip Flexors"]
  }
];

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

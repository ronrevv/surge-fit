// ⚡ SURGEFIT EXERCISE DATABASE — 100% WORKING ANIMATED GIFS
// Direct CDN URLs from GitHub repository: https://github.com/omercotkd/exercises-gifs

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
    id: "ex_0001",
    name: "Barbell Full Squat",
    category: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0001.gif",
    instructions: [
      "Barbell rested on shoulders, feet shoulder-width apart.",
      "Lower hips back and down until thighs are parallel to ground.",
      "Drive upward back to full stance."
    ],
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"]
  },
  {
    id: "ex_0002",
    name: "Incline Dumbbell Bench Press",
    category: "Chest",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0002.gif",
    instructions: [
      "Set bench to 30-degree incline.",
      "Press dumbbells directly over upper chest.",
      "Lower until elbows reach 90-degree angle."
    ],
    targetMuscles: ["Upper Pectoralis", "Anterior Deltoids", "Triceps"]
  },
  {
    id: "ex_0003",
    name: "Wide-Grip Lat Pulldown",
    category: "Back",
    equipment: "Cable",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0003.gif",
    instructions: [
      "Grasp wide bar with overhand grip.",
      "Pull bar down towards upper chest while arching upper back slightly.",
      "Slowly return bar to top starting position."
    ],
    targetMuscles: ["Latissimus Dorsi", "Rhomboids", "Biceps"]
  },
  {
    id: "ex_0006",
    name: "Seated Dumbbell Shoulder Press",
    category: "Shoulders",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0006.gif",
    instructions: [
      "Sit upright with back supported.",
      "Press dumbbells vertically over head.",
      "Lower dumbbells until elbows align with shoulders."
    ],
    targetMuscles: ["Anterior Deltoids", "Lateral Deltoids", "Triceps"]
  },
  {
    id: "ex_0007",
    name: "Barbell Conventional Deadlift",
    category: "Back",
    equipment: "Barbell",
    difficulty: "Advanced",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0007.gif",
    instructions: [
      "Stand with feet under barbell.",
      "Hinge at hips, grip bar shoulder-width apart.",
      "Drive through heels and lock out hips vertically."
    ],
    targetMuscles: ["Hamstrings", "Glutes", "Erector Spinae"]
  },
  {
    id: "ex_0009",
    name: "Rope Tricep Cable Pushdown",
    category: "Arms",
    equipment: "Cable",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0009.gif",
    instructions: [
      "Attach rope attachment to high cable pulley.",
      "Keep elbows pinned to body, press downward.",
      "Spread rope ends apart at peak contraction."
    ],
    targetMuscles: ["Triceps Lateral Head", "Triceps Long Head"]
  },
  {
    id: "ex_0010",
    name: "Standing Barbell Bicep Curl",
    category: "Arms",
    equipment: "Barbell",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0010.gif",
    instructions: [
      "Hold barbell with underhand grip shoulder-width apart.",
      "Curl bar upward keeping upper arms stationary.",
      "Squeeze biceps at top before slow descent."
    ],
    targetMuscles: ["Biceps Brachii", "Brachialis"]
  },
  {
    id: "ex_0011",
    name: "Hanging Abdominal Leg Raise",
    category: "Core",
    equipment: "Bodyweight",
    difficulty: "Advanced",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0011.gif",
    instructions: [
      "Hang from overhead pull-up bar.",
      "Raise legs to 90 degrees without swinging.",
      "Lower under full core control."
    ],
    targetMuscles: ["Lower Abs", "Hip Flexors"]
  },
  {
    id: "ex_0012",
    name: "Dumbbell Lateral Raise",
    category: "Shoulders",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0012.gif",
    instructions: [
      "Hold dumbbells at sides with slight elbow bend.",
      "Raise arms out to sides until shoulder height.",
      "Lower controlled back to start position."
    ],
    targetMuscles: ["Lateral Deltoids"]
  },
  {
    id: "ex_0013",
    name: "Flat Barbell Bench Press",
    category: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0013.gif",
    instructions: [
      "Lie on flat bench, grip bar slightly wider than shoulder width.",
      "Lower bar smoothly to mid-chest level.",
      "Press upward until arms are fully extended."
    ],
    targetMuscles: ["Pectoralis Major", "Triceps", "Anterior Deltoid"]
  },
  {
    id: "ex_0014",
    name: "Seated Cable Row",
    category: "Back",
    equipment: "Cable",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0014.gif",
    instructions: [
      "Sit at cable row machine with feet braced.",
      "Pull handle towards belly button while driving elbows back.",
      "Squeeze shoulder blades together at peak contraction."
    ],
    targetMuscles: ["Rhomboids", "Latissimus Dorsi", "Rear Deltoid"]
  },
  {
    id: "ex_0015",
    name: "Romanian Deadlift (RDL)",
    category: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0015.gif",
    instructions: [
      "Hold barbell at thigh level with slight knee bend.",
      "Push hips back while lowering bar along shin line.",
      "Squeeze glutes to return to standing lockout."
    ],
    targetMuscles: ["Hamstrings", "Glutes", "Lower Back"]
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

// ⚡ SURGEFIT ENTERPRISE EXERCISE CATALOG — COMPLETE ANIMATED GIF LIBRARY
// Direct high-speed CDN URLs from GitHub repository: https://github.com/omercotkd/exercises-gifs

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
    instructions: ["Rest barbell across traps.", "Lower hips parallel to floor.", "Drive up through heels."],
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"]
  },
  {
    id: "ex_0002",
    name: "Incline Dumbbell Bench Press",
    category: "Chest",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0002.gif",
    instructions: ["30-degree bench incline.", "Press dumbbells over chest.", "Lower elbows to 90 degrees."],
    targetMuscles: ["Upper Pectoralis", "Anterior Deltoid", "Triceps"]
  },
  {
    id: "ex_0003",
    name: "Wide-Grip Lat Pulldown",
    category: "Back",
    equipment: "Cable",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0003.gif",
    instructions: ["Overhand wide grip.", "Pull bar down to collarbone.", "Control return upward."],
    targetMuscles: ["Latissimus Dorsi", "Rhomboids", "Biceps"]
  },
  {
    id: "ex_0006",
    name: "Seated Dumbbell Shoulder Press",
    category: "Shoulders",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0006.gif",
    instructions: ["Sit back supported.", "Press dumbbells overhead.", "Lower to ear level."],
    targetMuscles: ["Anterior Deltoid", "Lateral Deltoid", "Triceps"]
  },
  {
    id: "ex_0007",
    name: "Barbell Conventional Deadlift",
    category: "Back",
    equipment: "Barbell",
    difficulty: "Advanced",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0007.gif",
    instructions: ["Feet under bar.", "Hinge hips and grip bar.", "Drive through floor to lockout."],
    targetMuscles: ["Hamstrings", "Glutes", "Erector Spinae"]
  },
  {
    id: "ex_0009",
    name: "Rope Tricep Cable Pushdown",
    category: "Arms",
    equipment: "Cable",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0009.gif",
    instructions: ["Elbows pinned to sides.", "Push rope down smoothly.", "Spread handles at bottom."],
    targetMuscles: ["Triceps Lateral Head", "Triceps Long Head"]
  },
  {
    id: "ex_0010",
    name: "Standing Barbell Bicep Curl",
    category: "Arms",
    equipment: "Barbell",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0010.gif",
    instructions: ["Underhand grip.", "Curl bar to chest.", "Squeeze biceps at top."],
    targetMuscles: ["Biceps Brachii", "Brachialis"]
  },
  {
    id: "ex_0011",
    name: "Hanging Abdominal Leg Raise",
    category: "Core",
    equipment: "Bodyweight",
    difficulty: "Advanced",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0011.gif",
    instructions: ["Hang from pull-up bar.", "Raise legs to 90 degrees.", "Lower under full control."],
    targetMuscles: ["Lower Abs", "Hip Flexors"]
  },
  {
    id: "ex_0012",
    name: "Dumbbell Lateral Raise",
    category: "Shoulders",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0012.gif",
    instructions: ["Slight elbow bend.", "Raise arms to shoulder height.", "Control lowering phase."],
    targetMuscles: ["Lateral Deltoid"]
  },
  {
    id: "ex_0013",
    name: "Flat Barbell Bench Press",
    category: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0013.gif",
    instructions: ["Lie flat on bench.", "Lower bar to mid-chest.", "Press up to lockout."],
    targetMuscles: ["Pectoralis Major", "Triceps"]
  },
  {
    id: "ex_0014",
    name: "Seated Cable Row",
    category: "Back",
    equipment: "Cable",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0014.gif",
    instructions: ["Brace feet on platform.", "Pull handle to torso.", "Squeeze shoulder blades."],
    targetMuscles: ["Rhomboids", "Lats"]
  },
  {
    id: "ex_0015",
    name: "Romanian Deadlift (RDL)",
    category: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0015.gif",
    instructions: ["Slight knee bend.", "Push hips back along shin line.", "Squeeze glutes to lockout."],
    targetMuscles: ["Hamstrings", "Glutes"]
  },
  {
    id: "ex_0016",
    name: "Dumbbell Hammer Curl",
    category: "Arms",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0016.gif",
    instructions: ["Neutral grip palms facing.", "Curl dumbbell to shoulder.", "Squeeze brachialis."],
    targetMuscles: ["Brachialis", "Forearms"]
  },
  {
    id: "ex_0017",
    name: "Cable Chest Flyes",
    category: "Chest",
    equipment: "Cable",
    difficulty: "Intermediate",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0017.gif",
    instructions: ["Set cables at chest height.", "Bring handles together in arch motion.", "Squeeze inner chest."],
    targetMuscles: ["Pectoralis Major", "Anterior Deltoid"]
  },
  {
    id: "ex_0018",
    name: "Bodyweight Push-Up",
    category: "Chest",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0018.gif",
    instructions: ["Plank position.", "Lower chest to ground.", "Press back up to lockout."],
    targetMuscles: ["Pectoralis Major", "Triceps", "Core"]
  },
  {
    id: "ex_0019",
    name: "Barbell Overhead Military Press",
    category: "Shoulders",
    equipment: "Barbell",
    difficulty: "Advanced",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0019.gif",
    instructions: ["Bar at collarbone.", "Press bar straight overhead.", "Lock out elbows at top."],
    targetMuscles: ["Anterior Deltoid", "Triceps", "Upper Chest"]
  },
  {
    id: "ex_0020",
    name: "Face Pulls with Cable Rope",
    category: "Shoulders",
    equipment: "Cable",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0020.gif",
    instructions: ["Set cable to eye level.", "Pull rope towards face.", "Externally rotate shoulders."],
    targetMuscles: ["Rear Deltoids", "External Rotators", "Rhomboids"]
  },
  {
    id: "ex_0022",
    name: "Leg Extension Machine",
    category: "Legs",
    equipment: "Machine",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0022.gif",
    instructions: ["Sit back in machine.", "Extend legs to full knee lockout.", "Control return down."],
    targetMuscles: ["Quadriceps"]
  },
  {
    id: "ex_0023",
    name: "Lying Leg Curl Machine",
    category: "Legs",
    equipment: "Machine",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0023.gif",
    instructions: ["Lie face down on bench.", "Curl pad towards glutes.", "Slow eccentric return."],
    targetMuscles: ["Hamstrings"]
  },
  {
    id: "ex_0024",
    name: "Calf Raise Machine",
    category: "Legs",
    equipment: "Machine",
    difficulty: "Beginner",
    gifUrl: "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0024.gif",
    instructions: ["Pads on shoulders.", "Drive up on toes.", "Squeeze calves at top."],
    targetMuscles: ["Gastrocnemius", "Soleus"]
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

// ⚡ SURGEFIT AI SYSTEM PROMPTS — OPTIMIZED FOR TOKEN EFFICIENCY & ACCURACY

export type RoleType =
  | "super_admin"
  | "chain_owner"
  | "chain_manager"
  | "branch_manager"
  | "trainer"
  | "independent_trainer"
  | "trainee";

export const ROLE_SYSTEM_PROMPTS: Record<RoleType, string> = {
  super_admin: `You are Surge AI Platform Architect. Provide concise, token-efficient system governance, database RLS isolation audits, and API token billing forecasts. Use bullet points and numeric metrics. Zero conversational fluff.`,
  
  chain_owner: `You are Surge AI Financial & Expansion Copilot for Gym Chain Owners. Provide precise 12-month ARR projections, branch P&L efficiency checks, and membership campaign strategies. Keep answers under 150 words with clear metrics.`,

  chain_manager: `You are Surge AI Regional Operations Analyst. Provide side-by-side branch KPI comparisons, trainer utilization analysis, and regional churn reduction tactics in brief, structured bullet points.`,

  branch_manager: `You are Surge AI Branch Operations Assistant. Analyze turnstile attendance velocity, peak floor capacity hours, and equipment maintenance schedules. Output actionable, concise bullet points.`,

  trainer: `You are Surge AI Exercise & Nutrition Scientist for Gym Trainers. Generate structured workout plans (exercise, sets, reps, rest) and macro meal plans. Always format exercises clearly. Keep outputs punchy and dense.`,

  independent_trainer: `You are Surge AI Business Growth Assistant for Independent Coaches. Provide client retainer pricing recommendations, check-in form analysis, and automated client re-engagement copy concisely.`,

  trainee: `You are Surge AI Personal Recovery & Fitness Coach. Provide active recovery flows, post-workout nutrition advice, and progressive overload tips. Use clean bullet points and encouraging, concise language.`,
};

export const QUICK_ACCURATE_PROMPTS: Record<
  RoleType,
  { label: string; prompt: string; responseTemplate: string }[]
> = {
  trainee: [
    {
      label: "🧘 Active Recovery Flow",
      prompt: "Recommend a 15-min recovery flow for sore quads & hamstrings.",
      responseTemplate: "🧘 **15-Min Quad & Hamstring Recovery Flow:**\n- 5m Zone-1 Bike/Rower spin\n- 90s Kneeling Quad Stretch (2x per side)\n- 90s Standing Single-Leg Hamstring Stretch\n- 3m Diaphragmatic Breathing (4-7-8 tempo)",
    },
    {
      label: "🥗 500kcal High-Protein Meal",
      prompt: "Suggest a 500kcal meal with 45g+ protein.",
      responseTemplate: "🥗 **High-Protein Fuel Bowl (510 kcal | 48g P | 52g C | 12g F):**\n- 180g Grilled Chicken Breast\n- 150g Cooked Jasmine Rice\n- 100g Steamed Broccoli & 15g Almonds",
    },
  ],
  trainer: [
    {
      label: "🏋️ 4-Day Push/Pull/Legs",
      prompt: "Generate a 4-day hypertrophy split.",
      responseTemplate: "💪 **4-Day Hypertrophy Split:**\n- **Day 1 (Push):** Incline DB Press (4x8), DB Shoulder Press (3x10), Cable Flyes (3x12)\n- **Day 2 (Pull):** Barbell Rows (4x8), Lat Pulldowns (3x10), Face Pulls (4x15)\n- **Day 3 (Legs):** Barbell Squats (4x6), RDLs (3x10), Standing Calf Raises (4x15)\n- **Day 4 (Upper):** Bench Press (3x8), Pull-ups (3xMax), Lateral Raises (4x15)",
    },
    {
      label: "📊 Client Fatigue Assessment",
      prompt: "Analyze client fatigue and suggest plan tweak.",
      responseTemplate: "📊 **Fatigue Diagnosis & Adjustment:**\n- **Finding:** Client Sarah logged 140kg Squat PR; CNS fatigue high.\n- **Tweak:** Swap heavy RDLs tomorrow for Lying Leg Curls (4x12) & add 10m foam rolling.",
    },
  ],
  independent_trainer: [
    {
      label: "💳 High-Ticket Retainer Model",
      prompt: "Suggest online coaching pricing tiers.",
      responseTemplate: "💳 **Recommended Online Coaching Tiers:**\n- **Tier 1 (Pro):** $350/mo (Custom workout & diet + weekly check-in)\n- **Tier 2 (VIP 1-on-1):** $650/mo (Daily WhatsApp access + form video reviews + bi-weekly video call)",
    },
  ],
  branch_manager: [
    {
      label: "📈 Peak Floor Hours",
      prompt: "Predict today's turnstile peak hours.",
      responseTemplate: "📈 **Branch Turnstile Forecast:**\n- **Peak 1:** 06:30 AM - 08:30 AM (Est 190 check-ins)\n- **Peak 2:** 05:00 PM - 07:30 PM (Est 230 check-ins - 92% capacity)\n- **Action:** Ensure 4 floor staff active on equipment wiping & spotter duties.",
    },
  ],
  chain_manager: [
    {
      label: "🏢 Regional Retention Check",
      prompt: "Compare regional branch churn rates.",
      responseTemplate: "🏢 **Regional Churn Comparison:**\n- Downtown Flagship: 1.8% Churn (Top Performer)\n- Westside Hub: 2.3% Churn (Optimal)\n- North District: 3.8% Churn (Flagged: Increase trainer onboarding touchpoints)",
    },
  ],
  chain_owner: [
    {
      label: "💰 12-Month ARR Projection",
      prompt: "Project ARR with 15% branch expansion.",
      responseTemplate: "💰 **12-Month ARR Growth Model:**\n- Current ARR: $5.14M\n- Projected ARR (+15% Expansion): $6.28M (+22.1% Net Margin)\n- Key Driver: Personal Training Add-on Subscription bundle adoption.",
    },
  ],
  super_admin: [
    {
      label: "🛡️ RLS & Token Audit",
      prompt: "Run platform AI token & database audit.",
      responseTemplate: "🛡️ **Platform Health Audit:**\n- Database Isolation: 100% RLS Enforcement Verified\n- Total Token Usage: 14.2M Tokens\n- Anomaly Check: Zero unauthorized cross-tenant queries detected.",
    },
  ],
};

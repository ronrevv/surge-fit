# SurgeFit

**SurgeFit** is an AI-powered fitness ecosystem built with Next.js, Supabase, and Tailwind CSS. It is the operating system for the fitness industry, connecting Trainees, Trainers, Gym Branches, Gym Chains, and Fitness Businesses together in a single, cohesive, premium experience.

## Features

*   **Multi-Role Dashboards:** Distinct and tailored experiences for Trainees, Independent Trainers, and Gym Managers.
*   **Dynamic Plans:** Real-time assignment and tracking of Workouts, Diets, and Schedules using a reactive state and Supabase backend.
*   **Premium Design System:** A meticulously crafted interface using a dark mode first approach, glassmorphism, floating cards, and beautiful typography (Manrope & Inter).
*   **TanStack Query Integration:** Seamless asynchronous data fetching and cache invalidation.
*   **Supabase Backend:** Scalable PostgreSQL database with Row Level Security (RLS) to ensure data privacy between different roles.

## Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
*   **State & Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
*   **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup (Supabase)

1. Create a new project in Supabase.
2. Run the SQL migration file located at `supabase/migrations/00001_initial_schema.sql` in your Supabase SQL Editor.
3. Update your local `.env.local` file with your Supabase URL and Anon Key:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

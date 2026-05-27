# Data Fetching Standards

## Rule: Server Components Only

**All data fetching must happen in Server Components. No route handlers. No client-side fetching.**

This is a hard rule with no exceptions. Data never flows through `fetch()` in a Client Component, through an API route handler (`app/api/`), or through any client-side state library (SWR, React Query, etc.).

## What This Means in Practice

- **Do not** create `app/api/` route handlers for data fetching purposes.
- **Do not** call `fetch()`, `axios`, or any HTTP client inside a Client Component.
- **Do not** write raw SQL queries anywhere in the codebase.
- **Do** fetch data by calling helper functions from the `/data` directory directly inside `async` Server Components.
- **Do** keep all database logic inside `/data` helper functions — pages and components must never import from `src/db` directly.

## The `/data` Directory

Every database query lives in a helper function inside `src/data/`. These functions:

- Use Drizzle ORM exclusively — no raw SQL, no `db.execute()` with a raw string.
- Accept only the parameters they need — never accept a userId from the caller; always read it from the session (see Security below).
- Return plain objects or arrays — not Drizzle query builder instances.

```
src/
  data/
    workouts.ts    ← e.g. getWorkouts(), getWorkoutById()
    exercises.ts   ← e.g. getExercises()
    sets.ts        ← e.g. getSetsForWorkout()
  app/
    dashboard/
      page.tsx     ← async Server Component that calls data/ helpers
```

### Example helper

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example Server Component

```tsx
// src/app/dashboard/page.tsx
import { getWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getWorkouts();
  // render ...
}
```

## Security: Users Must Only Access Their Own Data

**Every `/data` helper that queries user-owned rows must scope the query to the currently authenticated user.**

- Call `auth()` from `@clerk/nextjs/server` inside the helper — never trust a `userId` passed in as a parameter.
- Always add a `.where(eq(table.userId, userId))` clause (or equivalent join condition) so a user can never retrieve another user's rows.
- If `userId` is `null` (unauthenticated), throw immediately — do not return an empty array or a fallback.

Failing to scope a query to the current user is a critical security bug. There are no exceptions to this rule.

## Rationale

Keeping all data fetching in Server Components eliminates an entire class of client/server round-trips, avoids exposing an API surface that could be called outside of the app, and makes it straightforward to enforce per-user data scoping in one place — inside the `/data` helpers — rather than scattered across the codebase.

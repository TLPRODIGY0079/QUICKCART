# Login first, then home

The first screen is always `/login`. Signed-out visitors are sent there from any URL. After signing in you land on the home page (`/`).
Sign-in uses **Supabase Auth** through a tiny built-in client (`src/lib/sb.ts`, no new npm package, so `pnpm-lock.yaml` stays valid).

## Connect Supabase (5 minutes)
1. Create a Supabase project. Authentication > Providers: Email on (turn off "Confirm email" while testing).
2. Authentication > URL Configuration: set Site URL to your Netlify address (and `http://localhost:3000` for local work).
3. Copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (anon key only, never service_role).
4. `pnpm install && pnpm dev`, open http://localhost:3000. You should see the sign-in page first.
5. Netlify: Site settings > Environment variables: add the same two `VITE_` variables, then redeploy (they are read at build time).

Without the two variables the sign-in page shows a **Continue in demo mode** button so you can still click around.

## What changed in this version
- `src/lib/sb.ts` Supabase client (auth, REST, storage upload) / `src/lib/auth.tsx` AuthProvider + `useAuth()`.
- `src/components/tuma/auth-gate.tsx` redirects: signed out -> `/login`, signed in on `/login` -> `/`.
- `src/routes/login.tsx` sign in / create account (name, phone, and "I'm here to": client, runner or store owner; runner and store requests are recorded for admin review).
- `src/routes/__root.tsx` wraps the app in the gate. `site-header.tsx` shows "Hi, name" and Sign out.

## Still on sample data (next steps, see PLAN.md)
Jobs, runners, stores and products still come from `src/data/fixtures.ts`. Next: Supabase tables + RLS for jobs, runner matching/offers,
store catalogues with photo upload, chat, and admin approval of runners and stores. Not built or run in the authoring environment
(no internet there): run `pnpm install && pnpm typecheck && pnpm build` first and send back any errors.

---

# Tuma: send a runner for anything in Zambia

Tuma connects people across Zambia with nearby runners who shop, deliver and run errands for them: groceries from Soweto Market, parcels across town, school pickups, airport pickups, car-servicing runs and more. Stores can create accounts to show what they sell, and runners nearby deliver it.

The platform matches each job to the runner closest to **where the job starts** (the shop, school, airport or garage), then weighs rating, vehicle and specialty.

## What's live now
- **Landing page** (`/`): quick-book, services, how matching works, featured stores.
- **Send a runner** (`/request`): booking, ranked runner matches on a map, booking confirmation and a tracking timeline.
- **Stores** (`/stores`, `/stores/:id`): searchable directory and store catalogues with a basket.
- **Runner jobs** (`/runners`): jobs near the runner, online toggle, accept.
- **For business** (`/business`): create a store account with live preview.

Data is currently stubbed in `src/data/fixtures.ts`.

## Tech
TanStack Start (React 19, TanStack Router), Vite, Tailwind CSS 4, shadcn/ui components, lucide icons, deployed on Netlify. Images are served through the Netlify Image CDN.

## Run locally
```bash
pnpm install
netlify dev   # or: pnpm dev
```

## Roadmap
See [PLAN.md](PLAN.md). Next up: the data model on Netlify Database, then accounts and roles (client, runner, store owner), a real booking and matching API, store management, mobile-money payments, and safety features for school and airport runs.

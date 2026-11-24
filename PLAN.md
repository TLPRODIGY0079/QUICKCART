# Tuma: product roadmap

Tuma is a Zambia-wide "send a runner for anything" platform. It combines shop-and-deliver (DoorDash-style), people transport (Uber-style), and parcel and errand runs (Yango Deli-style) in one app, plus store accounts with product catalogues.

Each milestone is a small, self-contained piece of work. Continue from the first unchecked milestone.

## Milestone 1: Product surface ✅
- Landing page with quick-book, services, the matching explainer, a store strip and runner/store CTAs.
- `/request` booking flow: choose a service, pickup and drop-off, notes, time and payment, see runners ranked by distance to the **pickup point**, book, then watch the tracking timeline.
- `/stores` directory (search, category, town) and `/stores/$storeId` catalogue with a basket that hands off to `/request`.
- `/runners` job board for runners, sorted by distance from their current area, with online toggle and accept.
- `/business` store account creation with live preview.
- All data is stubbed in `src/data/fixtures.ts`. Matching and pricing live in `src/lib/matching.ts`.

## Milestone 2: Data model (Netlify Database + Drizzle)
- Tables: `users`, `runner_profiles` (vehicle, verification status, specialties, last location), `stores`, `products`, `areas`, `jobs` (service, pickup/dropoff coordinates, notes, schedule, price, status), `job_events` (status timeline), `payments`.
- Seed from `fixtures.ts`, then replace fixture imports with route loaders and server functions.

## Milestone 3: Accounts & roles (Netlify Identity)
- Sign up and log in for three roles: **client**, **runner**, **store owner**.
- Protect `/runners` (runner only) and store management (store owner only).
- Runner onboarding: NRC, selfie and vehicle documents (uploaded to Netlify Blobs), plus a review queue.

## Milestone 4: Real booking & matching API
- Server function to create a job, run `matchRunners` against live runner locations (stored in the DB), and offer the job to the top N runners in turn with a short acceptance timeout.
- Runners send location updates. Jobs move through `requested → assigned → at_pickup → in_progress → delivered`.
- Client tracking page reads real job events (polling first, then live updates).

## Milestone 5: Store management
- Store owner dashboard: edit profile, add and edit products with photos (Blobs plus Image CDN), mark items out of stock, see incoming orders.
- Persist `/business` submissions. Admin approval before a store goes public.

## Milestone 6: Payments
- Mobile money (Airtel Money, MTN MoMo) and cards through a Zambian-capable provider (e.g. Flutterwave), plus cash on delivery.
- Runner wallet and daily payouts. Platform commission configuration.

## Milestone 7: Trust & safety for people services
- School pickups: guardian-approved runner list, pickup PIN, photo check-in at the gate.
- Airport runs: flight number capture and a meet-and-greet name board.
- Ratings, reviews, SOS button, and trip sharing with family.

## Milestone 8: Maps, chat & notifications
- Replace the stylised `MiniMap` with a real map (Mapbox or Google Maps), with address autocomplete and pin-drop.
- In-app chat between client and runner (photo substitutions for shopping), masked calling.
- SMS/WhatsApp notifications for job status.

## Milestone 9: Operations
- Admin console: live jobs, runner verification, disputes and refunds, pricing per town.
- Expand areas beyond Lusaka, Kitwe, Ndola and Livingstone.

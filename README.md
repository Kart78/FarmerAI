# FarmerAI — Agri Marketplace (Farmer Console)

Vite + React + Tailwind app matching the FarmerAI design reference: Dashboard,
5-step Add Produce wizard with AI price suggestions, My Listings, Orders,
Deliveries live map, and a live AI Assistant chat (calls the Claude API
directly from the browser).

## Run locally (PowerShell)

```powershell
npm install
npm run dev
```

Opens at http://localhost:5173

## Connect Supabase (for real data)

1. Create a project at https://supabase.com
2. Copy `.env.example` to `.env` and fill in your project URL and anon key:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. `src/lib/supabaseClient.js` already exports a configured client — swap the
   mock data in `src/data/mock.js` for real Supabase queries screen by screen
   (Dashboard stats, My Listings, Orders are the natural starting points).
4. Suggested tables: `farmers`, `produce_listings`, `orders`, `payments`.

## Deploy to Vercel (PowerShell)

```powershell
# one-time
npm install -g vercel

# from the project folder
vercel login
vercel --prod
```

Or push to GitHub and import the repo in the Vercel dashboard — every push to
`main` will auto-deploy after that.

```powershell
git init
git add .
git commit -m "FarmerAI console scaffold"
git branch -M main
git remote add origin https://github.com/Kart78/<your-repo-name>.git
git push -u origin main
```

In Vercel's project settings, add the two `VITE_SUPABASE_*` environment
variables so the deployed build can reach your Supabase project.

## What's real vs. mock right now

- **Real**: all navigation, the 5-step Add Produce wizard logic and AI price
  comparison math, the Orders accept flow, and the AI Assistant (genuinely
  calls the Claude API).
- **Mock**: the numbers on Dashboard, My Listings, and Orders come from
  `src/data/mock.js` until Supabase is wired in.

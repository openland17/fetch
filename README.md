# Fetch — Dog Park Network MVP

Mobile-first web app demo for **Fetch**, a proximity-based dog social network.

## Description

Fetch lets dog owners see which dogs are at nearby parks, track play sessions, and get notified when their dog’s friends arrive. This MVP is a **client-side demo** with mock data — no backend or API required.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **tailwind-merge** + **clsx**

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Best viewed at 390px width (mobile) or in a centered phone-style frame on desktop.

## Build & production

```bash
npm run build
npm run start
```

If port 3000 is in use, run `PORT=3001 npm run start` (or set `PORT` in your environment).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo.
3. Leave build settings as default (Next.js).
4. Deploy. Vercel will run `npm run build` and serve the app.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/fetch-mvp)

*(Replace `your-username/fetch-mvp` with your repo URL.)*

## Data

**All data is mocked.** No database or API. State is kept in React + `localStorage` so it survives refresh. Dog photos use [placedog.net](https://placedog.net) for demo images.

## Project structure

- `src/app/` — Next.js App Router pages
- `src/components/` — UI and screen components
- `src/data/` — Mock data (dogs, parks, visits, notifications)
- `src/hooks/` — App state (context + localStorage)
- `src/lib/` — Utilities and helpers
- `src/types/` — TypeScript interfaces

## License

Private / demo use.

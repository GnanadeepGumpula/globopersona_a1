# Globopersona Frontend

Modern Next.js frontend for the Globopersona email marketing workspace.

## What’s included
- Dashboard with KPI cards, trend charts, and recent activity
- Campaigns list with status, performance, and filters
- Campaign creation form with audience and content fields
- Contacts and settings pages
- Responsive app shell with sidebar, header, and mobile menu
- Backend-driven data loading for campaigns, contacts, settings, dashboard, search, and notifications

## Tech stack
- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Lucide React icons

## Run locally
```bash
npm install
npm run dev
```

Open http://localhost:3001.

## Backend connection
Create a `.env.local` file based on `.env.example` and keep `NEXT_PUBLIC_API_BASE_URL=/api`. The frontend rewrites `/api/*` to the backend running on `http://localhost:3000`, so the browser stays same-origin and avoids CORS.

## Production build
```bash
npm run build
npm run start
```

## Project structure
- `src/app/` page routes and shared layout
- `src/components/` reusable UI and shell components
- `src/lib/` backend API client and shared types
- `src/app/globals.css` global styles and Tailwind layers

## Routes
- `/` dashboard
- `/campaigns` campaigns list
- `/campaigns/new` campaign creation
- `/contacts` contacts
- `/settings` workspace settings

## API expectations
- `GET /dashboard/summary`
- `GET /campaigns`
- `GET /contacts`
- `GET /settings`
- `GET /search?q=`
- `GET /notifications`
- `POST /notifications/mark-all-read`

The frontend assumes these endpoints return JSON shaped to the shared types in `src/lib/types.ts`.

## Design notes
- Bright office-style palette with warm neutrals and teal accents
- Large cards, clear hierarchy, and generous spacing
- Consistent rounded controls and table styling
- Responsive navigation that adapts to smaller screens
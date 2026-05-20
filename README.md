# Globopersona Frontend

Modern Next.js frontend for the Globopersona email marketing workspace.

## What’s included
- Dashboard with KPI cards, trend charts, and recent activity
- Campaigns list with status, performance, and filters
- Campaign creation form with audience and content fields
- Contacts and settings pages
- Responsive app shell with sidebar, header, and mobile menu
- Mock data only; no backend calls required for the demo UI

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

Open http://localhost:3000.

## Production build
```bash
npm run build
npm run start
```

## Project structure
- `src/app/` page routes and shared layout
- `src/components/` reusable UI and shell components
- `src/data/` mock dashboard and campaign data
- `src/app/globals.css` global styles and Tailwind layers

## Routes
- `/` dashboard
- `/campaigns` campaigns list
- `/campaigns/new` campaign creation
- `/contacts` contacts
- `/settings` workspace settings

## Design notes
- Bright office-style palette with warm neutrals and teal accents
- Large cards, clear hierarchy, and generous spacing
- Consistent rounded controls and table styling
- Responsive navigation that adapts to smaller screens
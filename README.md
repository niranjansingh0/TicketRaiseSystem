# Ticket Raising System — Serverless (Vercel)

This project is adapted to run as serverless functions on **Vercel** (or other platforms supporting Node serverless functions).

## Structure
- `api/tickets.js` - Handles GET (list) and POST (create) requests on `/api/tickets`.
- `api/tickets/[id]/complete.js` - Handles PUT to mark a ticket completed at `/api/tickets/:id/complete`.
- `lib/db.js` - Mongoose connection and Ticket model with connection reuse (important in serverless).
- `public/` - Frontend files (index.html, index.js, style.css) — simple UI that talks to `/api/tickets`.

## Environment
Provide the following environment variable when deploying:
- `MONGODB_URI` — your MongoDB connection string.

## Deploy to Vercel
1. Install Vercel CLI or use the Vercel dashboard.
2. Set the `MONGODB_URI` env var in the project settings on Vercel.
3. Deploy (via `vercel` CLI or push to GitHub and connect to Vercel).

## Notes
- The project uses connection reuse to avoid creating new DB connections on each cold start.
- The frontend is placed in `public/` and talks to `/api/tickets` (relative paths).

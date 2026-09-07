# Production Deployment Guide: K-12 Quality Inspection System

This guide details step-by-step instructions for deploying the **K-12 Education Quality Inspection & Root-Cause Intelligence System** to cloud infrastructure.

---

## Targeted Infrastructure

- **Frontend Application**: Vercel (React 18 + Vite SPA)
- **Backend API Service**: Render or Railway (Node.js + Express)
- **Database & Auth**: Supabase PostgreSQL
- **AI Decision Support**: Google Gemini API

---

## 1. Supabase PostgreSQL Setup

1. Create a new project in the [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor** tab.
3. Paste the contents of `supabase/migrations/0001_init.sql` and run the query.
4. Verify that all 25+ relational tables, indexes, and Row Level Security (RLS) policies are created.
5. Copy your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings -> API.

---

## 2. Render Backend Deployment

1. Create a new **Web Service** on [Render](https://render.com) connected to your GitHub repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add the following **Environment Variables**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-app-name.vercel.app`
   - `JWT_SECRET`: `[Your Random Secret Key]`
   - `SUPABASE_URL`: `[Your Supabase URL]`
   - `SUPABASE_ANON_KEY`: `[Your Supabase Anon Key]`
   - `SUPABASE_SERVICE_ROLE_KEY`: `[Your Supabase Service Role Key]`
   - `GEMINI_API_KEY`: `[Your Google Gemini API Key]`
   - `GEMINI_MODEL`: `gemini-1.5-pro`
6. Deploy the service and verify health check at `https://your-backend.onrender.com/api/health`. It must return `{"ok": true}`.

---

## 3. Vercel Frontend Deployment

1. Import the repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add the following **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`
   - `VITE_SUPABASE_URL`: `[Your Supabase URL]`
   - `VITE_SUPABASE_ANON_KEY`: `[Your Supabase Anon Key]`
5. Deploy. `frontend/vercel.json` will automatically handle SPA client-side route rewrites.

---

## 4. Verification Checklist

- [x] Backend responds to `GET /api/health` with `{"ok": true}`.
- [x] CORS policies allow frontend domain requests.
- [x] Gemini API key is securely retained on backend server only.
- [x] Global command search palette (`Cmd+K`) functions correctly.
- [x] Digital inspection sampling checklist runner executes smoothly.
- [x] AI Decision support approve/reject/override modal saves human reasoning.
- [x] CAPA closed-loop verification records auditor sign-offs.
- [x] Report CSV dataset export downloads cleanly.

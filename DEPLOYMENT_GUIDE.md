# Production Deployment Guide: K-12 Quality Inspection System

This guide details step-by-step instructions for deploying the **K-12 Education Quality Inspection & Root-Cause Intelligence System** to cloud infrastructure.

---

## 🎯 Supported Deployment Architectures

### Option A: Unified Vercel Monorepo Deployment (Recommended)
- **Frontend**: Vercel Static Web Hosting (`frontend/dist`)
- **Backend API**: Vercel Serverless Functions (`api/index.js`)
- **Database**: Supabase PostgreSQL
- **AI Engine**: Google Gemini 1.5 Pro API

### Option B: Decoupled Vercel (Frontend) + Render (Backend)
- **Frontend Application**: Vercel (`frontend/`)
- **Backend Web Service**: Render / Railway (`backend/`)
- **Database**: Supabase PostgreSQL
- **AI Engine**: Google Gemini 1.5 Pro API

---

## 1. Supabase Database Setup

1. Create a new project in the [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor** tab.
3. Paste the contents of `supabase/migrations/0001_init.sql` and run the query.
4. Verify all 25+ relational tables, indexes, and Row Level Security (RLS) policies are created.
5. Copy your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings -> API.

---

## 2. Option A: Deploy Entire App on Vercel

1. Connect your GitHub repository `https://github.com/dhanushkunduru/K-12-Education-Quality-Inspection-Root-Cause-Intelligence-System.git` on [Vercel](https://vercel.com).
2. Root Directory: `./` (leave default).
3. Vercel will automatically detect `vercel.json` and build the frontend using `npm run build` while deploying `api/index.js` as serverless functions.
4. In Vercel Project Settings -> Environment Variables, configure:
   - `JWT_SECRET`: `[Your Random Secret]`
   - `SUPABASE_URL`: `[Your Supabase URL]`
   - `SUPABASE_ANON_KEY`: `[Your Supabase Anon Key]`
   - `SUPABASE_SERVICE_ROLE_KEY`: `[Your Supabase Service Role Key]`
   - `GEMINI_API_KEY`: `[Your Google Gemini API Key]`
   - `GEMINI_MODEL`: `gemini-1.5-pro`
   - `VITE_API_BASE_URL`: `/api`
5. Deploy. The health check will be available at `https://your-vercel-domain.vercel.app/api/health`.

---

## 3. Option B: Deploy Backend on Render + Frontend on Vercel

### Step 1: Render Backend Deployment
1. Create a new **Web Service** on [Render](https://render.com) connected to your GitHub repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `FRONTEND_URL`: `https://your-app.vercel.app`
   - `JWT_SECRET`: `[Your Secret]`
   - `SUPABASE_URL`: `[Your Supabase URL]`
   - `SUPABASE_ANON_KEY`: `[Your Supabase Anon Key]`
   - `SUPABASE_SERVICE_ROLE_KEY`: `[Your Supabase Service Role Key]`
   - `GEMINI_API_KEY`: `[Your Google Gemini Key]`
   - `GEMINI_MODEL`: `gemini-1.5-pro`
6. Deploy and verify `https://your-backend.onrender.com/api/health` returns `{"ok": true}`.

### Step 2: Vercel Frontend Deployment
1. Create a Vercel project with **Root Directory** set to `frontend`.
2. Configure Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`
3. Deploy. `frontend/vercel.json` handles SPA routing rewrites.

---

## 4. Production Security Checklist

- [x] No `.env` files or API secrets committed to GitHub repository.
- [x] Gemini API key strictly isolated on backend server.
- [x] CORS origin locked to production frontend URL.
- [x] Supabase Row Level Security (RLS) policies enabled.
- [x] React Router SPA routes re-write configured (`vercel.json`).
- [x] `GET /api/health` verified with HTTP 200 `{ "ok": true }`.

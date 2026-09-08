# Production Deployment Guide: K-12 Quality Inspection System

This guide details step-by-step instructions for deploying the **K-12 Education Quality Inspection & Root-Cause Intelligence System** to cloud infrastructure.

---

## 🎯 Supported Deployment Architectures

### Option A: Vercel Frontend + Render Backend (Live Configuration)
- **Frontend**: Vercel Static Web Hosting (`frontend/dist`)
- **Backend API**: Render (`https://k-12-education-quality-inspection-root.onrender.com`)
- **Database**: Supabase PostgreSQL
- **AI Engine**: Google Gemini 1.5 Pro API

### Option B: Separate Vercel Frontend + Render Backend
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

## 2. Option A: Deploy Frontend on Vercel and Connect Render Backend

1. Connect your GitHub repository `https://github.com/dhanushkunduru/K-12-Education-Quality-Inspection-Root-Cause-Intelligence-System.git` on [Vercel](https://vercel.com).
2. Root Directory: `frontend`.
3. Vercel builds the React frontend. The frontend is already configured to call the live Render API.
4. In Vercel Project Settings -> Environment Variables, configure:
   - `JWT_SECRET`: `[Your Random Secret]`
   - `SUPABASE_URL`: `[Your Supabase URL]`
   - `SUPABASE_ANON_KEY`: `[Your Supabase Anon Key]`
   - `SUPABASE_SERVICE_ROLE_KEY`: `[Your Supabase Service Role Key]`
   - `GEMINI_API_KEY`: `[Your Google Gemini API Key]`
   - `GEMINI_MODEL`: `gemini-1.5-pro`
   - `VITE_API_BASE_URL`: `https://k-12-education-quality-inspection-root.onrender.com/api`
5. Deploy. The frontend is available at `https://k12-quality-inspection-system.vercel.app`.

### Vercel dashboard values

Use these exact values if Vercel asks for build settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | `.` |
| Build Command | `npm run build` |
| Output Directory | `frontend/dist` |
| Install Command | `npm install` |

Open `https://k-12-education-quality-inspection-root.onrender.com/api/health` to verify the backend. Then open the Vercel frontend and log in with any email and role; the demo backend accepts the role and provides seeded data.

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
2. The frontend production client is already configured for the live Render backend:
   - `VITE_API_BASE_URL`: `https://k-12-education-quality-inspection-root.onrender.com/api`
3. Deploy. `frontend/vercel.json` handles SPA routing rewrites.
4. Copy the Vercel production URL, then update the Render service environment variable:
   - `FRONTEND_URL`: `https://your-app.vercel.app`
5. Redeploy the Render service so CORS allows the Vercel frontend.

The Render backend health check is currently live at `https://k-12-education-quality-inspection-root.onrender.com/api/health`.

---

## 4. Production Security Checklist

- [x] No `.env` files or API secrets committed to GitHub repository.
- [x] Gemini API key strictly isolated on backend server.
- [x] CORS origin locked to production frontend URL.
- [x] Supabase Row Level Security (RLS) policies enabled.
- [x] React Router SPA routes re-write configured (`vercel.json`).
- [x] `GET /api/health` verified with HTTP 200 `{ "ok": true }`.

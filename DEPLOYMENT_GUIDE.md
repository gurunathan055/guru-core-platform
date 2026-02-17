# 🚀 Guru-Core Deployment Guide (Simple Steps)

## Step 1: Upload to GitHub (5 minutes)

### What you need:
- GitHub account (create free at github.com)
- Git installed on your computer

### Steps:

1. **Open Terminal/Command Prompt** and go to project folder:
   ```bash
   cd /Users/guru/Documents/aiagentguru/guru-core
   ```

2. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Guru-Core MVP"
   ```

3. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name: `guru-core`
   - Make it **Public** (free hosting needs public repo)
   - **DON'T** check any boxes (no README, no .gitignore)
   - Click "Create repository"

4. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/guru-core.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your actual GitHub username

✅ **Done!** Your code is now on GitHub.

---

## Step 2: Deploy Frontend to Vercel (FREE - 3 minutes)

### What you need:
- GitHub account (already done)
- Vercel account (free - sign up with GitHub)

### Steps:

1. **Go to Vercel**:
   - Visit https://vercel.com/signup
   - Click "Continue with GitHub"
   - Login and authorize Vercel

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Find `guru-core` repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click "Edit" → Select `apps/web`
   - **Build Command**: Leave default (`npm run build`)
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: `npm install`

4. **Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add these:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   OPENAI_API_KEY=sk-your-openai-key-here
   ```

   **For now, use DEMO values** (we'll setup real Supabase next):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-key
   OPENAI_API_KEY=demo-key
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `https://guru-core-xyz.vercel.app`

✅ **Done!** Your app is live but needs database.

---

## Step 3: Setup Free Database (Supabase - 5 minutes)

### Steps:

1. **Create Supabase Account**:
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - **Name**: guru-core-db
   - **Database Password**: Create strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Plan**: Free
   - Click "Create new project"
   - Wait 2 minutes for database to start

3. **Run Database Schema**:
   - In Supabase dashboard, go to "SQL Editor"
   - Click "New Query"
   - Open file: `/Users/guru/Documents/aiagentguru/guru-core/packages/database/schema.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click "Run"
   - You should see "Success. No rows returned"

4. **Get API Keys**:
   - In Supabase, click "Settings" (gear icon)
   - Click "API"
   - Copy these two:
     - **Project URL** (looks like: https://abcdefgh.supabase.co)
     - **anon/public key** (long string starting with "eyJ...")

5. **Update Vercel Environment Variables**:
   - Go back to Vercel dashboard
   - Click your project
   - Go to "Settings" → "Environment Variables"
   - **Edit** the two Supabase variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
   - Click "Save"

6. **Redeploy**:
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Wait 2 minutes

✅ **Done!** Your app now has a real database.

---

## Step 4: Test Your Live App (2 minutes)

1. **Open your Vercel URL** (e.g., https://guru-core-xyz.vercel.app)

2. **You should see Login Page**:
   - Email: `demo@guru-core.com`
   - Password: `demo123`
   - Click "Sign In"

3. **Explore the App**:
   - ✅ Dashboard with metrics
   - ✅ Analytics with charts
   - ✅ SOP Generator
   - ✅ Learning interface
   - ✅ Integration Studio
   - ✅ All pages work!

---

## Step 5: Share with Others

Your app is now live! Share these links:

- **Live App**: `https://your-app-name.vercel.app`
- **GitHub Code**: `https://github.com/YOUR_USERNAME/guru-core`

---

## 🎉 CONGRATULATIONS!

You now have:
- ✅ Code on GitHub (version control)
- ✅ Live website on Vercel (free hosting)
- ✅ Database on Supabase (free tier)
- ✅ Fully working demo app

---

## What's NOT Working Yet (Advanced Features - Do Later)

These need additional setup:

1. **Voice AI** - Needs OpenAI Realtime API key ($$$)
2. **AI Models (Llama/Mixtral)** - Needs Docker + Server (not free)
3. **Weaviate Vector DB** - Needs Docker + Server (not free)
4. **Real Freshdesk Integration** - Needs Freshdesk account + API key

**For Demo Purposes**: Current app works perfectly with mock data!

---

## Troubleshooting

### "Application error" on Vercel
- Check Environment Variables are set correctly
- Check build logs in Vercel dashboard

### "Failed to fetch" errors
- Supabase URL/key might be wrong
- Check browser console for errors

### Database not working
- Re-run the schema.sql in Supabase SQL Editor
- Check if tables were created (go to "Table Editor")

---

## Need Help?

1. Check Vercel deployment logs
2. Check browser console (F12 → Console)
3. Check Supabase logs (Logs & Reports section)

---

## Cost Summary

| Service | Cost | What You Get |
|---------|------|--------------|
| Vercel | **FREE** | Hosting, SSL, CDN, Unlimited deployments |
| Supabase | **FREE** | 500MB database, 2GB bandwidth, Auth, Storage |
| GitHub | **FREE** | Unlimited public repos |
| **TOTAL** | **$0/month** | Fully working demo app! |

### Optional Paid Features (Later)
- OpenAI API: ~$20/month (for voice AI)
- Server for Docker (Weaviate, Ollama): ~$10-50/month
- Custom domain: ~$12/year

---

## Next Steps (After Demo)

1. **Add Real Authentication**:
   - Enable Supabase Auth
   - Add signup flow
   - Add password reset

2. **Connect Real APIs**:
   - Get Freshdesk API key
   - Configure Integration Studio
   - Test real ticket creation

3. **Add AI Models**:
   - Setup server with Docker
   - Install Ollama + Llama
   - Setup Weaviate

4. **Enable Voice AI**:
   - Get OpenAI API key
   - Configure Realtime API
   - Test voice calls

---

**Good luck! 🚀**

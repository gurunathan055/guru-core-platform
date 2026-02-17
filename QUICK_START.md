# 🎯 Quick Commands - Copy & Paste

## 1️⃣ Upload to GitHub (5 minutes)

```bash
# Go to project folder
cd /Users/guru/Documents/aiagentguru/guru-core

# Setup Git
git init
git add .
git commit -m "Initial commit - Guru-Core MVP"

# Create repo on GitHub first, then run:
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/guru-core.git
git branch -M main
git push -u origin main
```

---

## 2️⃣ Deploy to Vercel (3 minutes)

**Visual Steps:**
1. Go to https://vercel.com/signup → Login with GitHub
2. Click "Add New..." → "Project"
3. Import `guru-core`
4. **Root Directory**: `apps/web` ⚠️ IMPORTANT!
5. Add Environment Variables (use demo values for now):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-key
   ```
6. Click "Deploy"
7. Get your URL: `https://your-app.vercel.app`

---

## 3️⃣ Setup Database (5 minutes)

**Visual Steps:**
1. Go to https://supabase.com → Sign in with GitHub
2. Click "New Project"
   - Name: `guru-core-db`
   - Password: (create strong password)
   - Region: (choose closest)
   - Click "Create"
3. Wait 2 minutes
4. Go to "SQL Editor" → "New Query"
5. Copy-paste schema from: `packages/database/schema.sql`
6. Click "Run"
7. Go to "Settings" → "API" → Copy:
   - Project URL
   - anon/public key
8. Update Vercel env variables with real values
9. Redeploy in Vercel

---

## ✅ Test Your App

Open: `https://your-app.vercel.app/login`

**Demo Login:**
- Email: `demo@guru-core.com`
- Password: `demo123`

---

## 🎉 That's It!

**Total Time:** 15 minutes  
**Total Cost:** $0 (100% FREE)

Your app is now live with:
- ✅ Login page
- ✅ Dashboard with charts
- ✅ Analytics with graphs
- ✅ SOP Generator (AI demo)
- ✅ Learning interface
- ✅ Integration Studio
- ✅ All responsive (works on mobile)

---

## Troubleshooting

**Build fails?**
- Check Root Directory is `apps/web` in Vercel

**White screen?**
- Check Environment Variables are set
- Check browser console (F12)

**Database errors?**
- Re-run schema.sql in Supabase
- Check if tables exist in "Table Editor"

---

Need detailed guide? See `DEPLOYMENT_GUIDE.md`

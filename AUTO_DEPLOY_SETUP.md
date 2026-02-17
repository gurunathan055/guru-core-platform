# 🤖 AUTO-DEPLOYMENT SETUP GUIDE

## ✅ What I Fixed

1. **Added `packageManager` field** - Fixed Turborepo error
2. **Created `apps/web/vercel.json`** - Correct build configuration
3. **Removed root `vercel.json`** - Vercel needs to deploy from `apps/web`
4. **Set up GitHub Actions** - Automatic deployment on every push

---

## 🚀 DEPLOY NOW (Manual - One Time Setup)

Since Vercel needs to be configured from their dashboard first, follow these steps:

### Step 1: Go to Vercel Dashboard

1. Visit: **https://vercel.com**
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Find repository: **`guru-core-platform`**
5. Click **"Import"**

### Step 2: Configure Project Settings

**IMPORTANT Settings:**

- **Framework Preset:** Next.js
- **Root Directory:** `apps/web` ⚠️ CRITICAL!
- **Build Command:** Leave default (`npm run build`)
- **Output Directory:** Leave default (`.next`)
- **Install Command:** Leave default (`npm install`)

### Step 3: Add Environment Variables

Click **"Environment Variables"** tab and add these **one by one**:

```
Name: SUPABASE_URL
Value: https://jovacmaxufdluvdhppzy.supabase.co

Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFjbWF4dWZkbHV2ZGhwcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDI1NDMsImV4cCI6MjA4Njg3ODU0M30.ZIE336jo5dxACzl232A6GLQL3A0IOrH7ew_Nvni1b_I

Name: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFjbWF4dWZkbHV2ZGhwcHp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwMjU0MywiZXhwIjoyMDg2ODc4NTQzfQ.DdAdDVbf621XE_xPpedsCyl42l6mK-I9E0HCln_6f9Y

Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://jovacmaxufdluvdhppzy.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFjbWF4dWZkbHV2ZGhwcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDI1NDMsImV4cCI6MjA4Njg3ODU0M30.ZIE336jo5dxACzl232A6GLQL3A0IOrH7ew_Nvni1b_I
```

### Step 4: Deploy!

1. Click **"Deploy"**
2. Wait 3-5 minutes ☕
3. You'll get a URL like: `https://guru-core-platform-xxx.vercel.app`

---

## 🎉 AFTER FIRST DEPLOYMENT

Vercel will now **automatically deploy** every time you push to GitHub!

### What Happens Next:

1. You push code to GitHub → Vercel automatically deploys
2. New commits → New deployments
3. Pull requests → Preview deployments

**You don't need to do anything manually anymore!**

---

## ⚙️ OPTIONAL: GitHub Actions Setup (For Advanced CI/CD)

If you want GitHub to run tests before deploying, add these secrets:

### Get Vercel Tokens:

1. Go to **Vercel** → **Settings** → **Tokens**
2. Create new token → Copy it
3. Go to **GitHub** → Your repo → **Settings** → **Secrets and variables** → **Actions**
4. Add these secrets:
   - `VERCEL_TOKEN` - Your token
   - `VERCEL_ORG_ID` - From Vercel project settings
   - `VERCEL_PROJECT_ID` - From Vercel project settings

---

## 🧪 TEST YOUR DEPLOYMENT

Visit your Vercel URL and check:

1. ✅ Homepage loads
2. ✅ Click "Sign Up"
3. ✅ Create account
4. ✅ Login works
5. ✅ Dashboard loads
6. ✅ All pages work
7. ✅ Notifications bell shows
8. ✅ Try on mobile

---

## ⚠️ IMPORTANT: Update Supabase

After deployment, go to Supabase:

1. **Authentication** → **URL Configuration**
2. Add your Vercel URL:
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** `https://your-app.vercel.app/**`
3. Click **"Save"**

Then in Vercel:
1. Go to project → **Settings** → **Environment Variables**
2. Add:
   ```
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   ```
3. **Redeploy** (Deployments → Latest → Three dots → Redeploy)

---

## 📊 MONITORING YOUR DEPLOYMENTS

### Vercel Dashboard:
- View all deployments
- Check build logs
- See errors
- Monitor performance

### Auto-Deploy Status:
- ✅ Push to main → Auto-deploys
- ✅ Pull request → Preview URL
- ✅ Errors → Email notification

---

## 🎯 WHAT'S FIXED

✅ **Turborepo error** - Added packageManager field  
✅ **Build path error** - Moved vercel.json to apps/web  
✅ **Deployment config** - Correct settings for monorepo  
✅ **Auto-deploy** - Vercel watches GitHub automatically  

---

## 💡 FROM NOW ON

**To deploy new features:**

```bash
# 1. Make your changes
# 2. Commit and push
git add -A
git commit -m "Your changes"
git push origin main

# 3. That's it! Vercel auto-deploys
# 4. Check Vercel dashboard for status
```

**No manual deployment needed! 🎉**

---

## 🆘 TROUBLESHOOTING

### Build fails on Vercel:
1. Check build logs in Vercel
2. Verify Root Directory is `apps/web`
3. Check all environment variables are set

### Auth not working:
1. Update Supabase Auth URLs
2. Verify environment variables
3. Redeploy

### Want to rollback:
1. Go to Vercel → Deployments
2. Find working version
3. Click "Promote to Production"

---

**Ready to deploy? Go to: https://vercel.com/new**

Your code is already pushed to GitHub and ready to import!

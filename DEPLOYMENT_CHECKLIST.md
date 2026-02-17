# 🚀 DEPLOYMENT CHECKLIST

## ✅ Pre-Deployment (Completed)

- ✅ Supabase project created
- ✅ Database URL: https://jovacmaxufdluvdhppzy.supabase.co
- ✅ Environment variables configured in .env
- ✅ Code pushed to GitHub: https://github.com/gurunathan055/guru-core-platform
- ✅ Package manager issues fixed
- ✅ Dependencies installed

---

## 🎯 Deploy to Vercel (5 minutes)

### Method 1: Vercel Dashboard (Recommended - Easier)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Find your repo: `guru-core-platform`
   - Click "Import"

3. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web` ⚠️ IMPORTANT!
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add these (copy from your .env file):

   ```
   SUPABASE_URL=https://jovacmaxufdluvdhppzy.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFjbWF4dWZkbHV2ZGhwcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDI1NDMsImV4cCI6MjA4Njg3ODU0M30.ZIE336jo5dxACzl232A6GLQL3A0IOrH7ew_Nvni1b_I
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFjbWF4dWZkbHV2ZGhwcHp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwMjU0MywiZXhwIjoyMDg2ODc4NTQzfQ.DdAdDVbf621XE_xPpedsCyl42l6mK-I9E0HCln_6f9Y
   NEXT_PUBLIC_SUPABASE_URL=https://jovacmaxufdluvdhppzy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFjbWF4dWZkbHV2ZGhwcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDI1NDMsImV4cCI6MjA4Njg3ODU0M30.ZIE336jo5dxACzl232A6GLQL3A0IOrH7ew_Nvni1b_I
   ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 3-5 minutes ☕
   - You'll get a URL like: `https://guru-core-platform-xxx.vercel.app`

---

### Method 2: Command Line (Alternative)

```bash
cd /Users/guru/Documents/aiagentguru/guru-core
npx vercel --prod
```

Follow the prompts:
- Set up and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: guru-core-platform
- Directory: `./apps/web`
- Override settings: No

---

## ⚠️ IMPORTANT: After Deployment

### 1. Update Supabase Auth URLs (REQUIRED)

Go to Supabase Dashboard:
1. **Authentication** → **URL Configuration**
2. Add your Vercel URL to:
   - **Site URL**: `https://your-app-name.vercel.app`
   - **Redirect URLs**: `https://your-app-name.vercel.app/**`
3. Click "Save"

### 2. Update Environment Variable

In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add new variable:
   ```
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   ```
3. **Redeploy** (Deployments → Three dots → Redeploy)

---

## 🧪 Testing Your Live App

Visit your URL and test:
1. ✅ Homepage loads
2. ✅ Click "Sign Up" - create account
3. ✅ Check email for verification
4. ✅ Login works
5. ✅ Dashboard loads
6. ✅ All pages accessible
7. ✅ Notifications work
8. ✅ Mobile view works

---

## 👤 Create Admin Account

### Method 1: Via Supabase Dashboard
1. Sign up on your live site
2. Go to Supabase → **Authentication** → **Users**
3. Copy your user UUID
4. Go to **Table Editor** → **profiles**
5. Find your row → Change `role` to `admin`
6. Refresh your live site
7. Visit `/admin` - you now have admin access!

### Method 2: Via SQL (Faster)
```sql
-- Run in Supabase SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## 🎉 Success! What's Next?

Your platform is now LIVE at: `https://your-app-name.vercel.app`

### Immediate Next Steps:
1. ✅ Test all features
2. ✅ Create admin account
3. ✅ Invite team members
4. ✅ Show to stakeholders

### Share Your Platform:
Send this to users:
> "Visit https://your-app-name.vercel.app to access the platform.
> Sign up with your email to get started!"

---

## 📊 Monitor Your Deployment

### Vercel Dashboard
- View deployments
- Check build logs
- Monitor performance
- View analytics

### Supabase Dashboard
- View users
- Check database
- Monitor API usage
- View logs

---

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel
- Verify environment variables are set
- Ensure Root Directory is `apps/web`

### Auth Not Working
- Check Supabase Auth URLs are updated
- Verify environment variables in Vercel
- Check browser console for errors

### Pages Not Loading
- Clear browser cache
- Check Vercel deployment status
- Verify all environment variables

---

## 💡 Pro Tips

1. **Auto-Deploy**: Any push to `main` branch auto-deploys
2. **Preview Deployments**: Push to other branches for preview URLs
3. **Environment Variables**: Different values for Production/Preview/Development
4. **Custom Domain**: Add your own domain in Vercel settings

---

## 📈 What You Get (Free Tier)

- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ 100GB bandwidth/month
- ✅ Analytics included
- ✅ No credit card required

---

**Ready to deploy? Go to: https://vercel.com**

**Questions? Check the Vercel documentation or Supabase docs!**

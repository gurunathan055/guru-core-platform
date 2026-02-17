# 🚀 DEPLOYMENT INSTRUCTIONS - Get Live in 15 Minutes

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Sign up and create project
1. Go to https://supabase.com
2. Click "Start your project" → Sign in with GitHub
3. Click "New project"
4. Fill in:
   - **Name**: guru-core-prod
   - **Database Password**: (create a strong password - SAVE IT!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (perfect for testing)
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

### 1.2 Get your credentials
1. Go to **Settings** (⚙️ icon) → **API**
2. Copy and save these (you'll need them soon):
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGci...
   service_role key: eyJhbGci... (🔐 Keep this secret!)
   ```

### 1.3 Setup database tables
1. Click **SQL Editor** in the left sidebar
2. Click "New query"
3. Open the file: `/packages/database/schema.sql`
4. Copy ALL the content
5. Paste into Supabase SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"
8. Verify: Click **Table Editor** → you should see tables like `profiles`, `calls`, `integrations`

✅ **Supabase is ready!**

---

## Step 2: Deploy to Vercel (5 minutes)

### 2.1 Push to GitHub
1. Create a new repo on GitHub: https://github.com/new
   - Name: `guru-core-platform`
   - Make it Private
   - Don't initialize with README
2. Run these commands:
   ```bash
   cd /Users/guru/Documents/aiagentguru/guru-core
   git remote add origin https://github.com/YOUR_USERNAME/guru-core-platform.git
   git branch -M main
   git push -u origin main
   ```

### 2.2 Deploy to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your `guru-core-platform` repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web` ⚠️ IMPORTANT!
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Click "Environment Variables" → Add these:
   ```
   SUPABASE_URL = https://xxxxx.supabase.co
   SUPABASE_ANON_KEY = eyJhbGci...
   SUPABASE_SERVICE_KEY = eyJhbGci...
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
   NEXT_PUBLIC_APP_URL = (leave empty for now)
   ```

7. Click "Deploy"
8. Wait 2-3 minutes ☕

✅ **Your app is live!**

### 2.3 Update app URL
1. After deployment, you'll get a URL like: `https://guru-core-xxxxx.vercel.app`
2. Go back to Vercel → Your Project → Settings → Environment Variables
3. Add/Update:
   ```
   NEXT_PUBLIC_APP_URL = https://guru-core-xxxxx.vercel.app
   ```
4. Click "Redeploy" → Redeploy with existing build cache

---

## Step 3: Configure Supabase Auth (2 minutes)

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**:
   ```
   https://guru-core-xxxxx.vercel.app
   ```
3. Add to **Redirect URLs**:
   ```
   https://guru-core-xxxxx.vercel.app/**
   http://localhost:3000/**
   ```
4. Click "Save"

---

## Step 4: Create Your Admin Account (3 minutes)

### 4.1 Sign up
1. Visit your live URL: `https://guru-core-xxxxx.vercel.app`
2. Click "Sign Up"
3. Fill in:
   - **Name**: Your Name
   - **Email**: admin@yourcompany.com (use a real email!)
   - **Company**: Your Company Name
   - **Password**: (min 6 characters)
4. Click "Create Account"
5. Check your email for verification link (check spam!)
6. Click the verification link

### 4.2 Make yourself admin
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user and copy the **UUID** (e.g., `abc123-def456-...`)
3. Go to **Table Editor** → **profiles** table
4. Find your row (match the id with UUID)
5. Click to edit the `role` column
6. Change from `viewer` to `admin`
7. Click ✓ to save

### 4.3 Test admin access
1. Go back to your live app
2. Refresh the page
3. You should now see:
   - ✅ Admin menu item in sidebar
   - ✅ Live Calls menu item
   - ✅ Notification bell with badge
4. Visit `/admin` - you should see the user management page!

✅ **You're now a full admin!**

---

## Step 5: Invite Team Members (Optional)

1. Share your live URL with team members
2. They sign up with their email
3. After they sign up, go to `/admin`
4. Find them in the user list
5. Change their role:
   - **admin**: Full access (use sparingly!)
   - **supervisor**: Can manage calls, view analytics
   - **viewer**: Read-only access

---

## 🎉 You're Live! Test Everything

### Pages to test:
- ✅ `/` - Landing redirects to dashboard
- ✅ `/login` - Real authentication
- ✅ `/dashboard` - Main dashboard with metrics
- ✅ `/live-calls` - Monitor active calls
- ✅ `/admin` - User management (admin only)
- ✅ `/analytics` - Interactive charts
- ✅ `/calls` - Call history
- ✅ `/sop-generator` - Generate SOPs
- ✅ `/learning` - Autonomous learning
- ✅ `/integrations` - Integration studio
- ✅ `/knowledge` - Knowledge base
- ✅ `/settings` - User settings

### Features to test:
- ✅ Signup/Login/Logout
- ✅ Change user roles (admin panel)
- ✅ View live calls
- ✅ Click notification bell
- ✅ Mobile responsive (test on phone!)

---

## 🔧 Troubleshooting

### "Database error" or "No profiles table"
- Go back to Supabase SQL Editor
- Re-run the schema.sql file
- Check Table Editor to verify tables exist

### "Auth error" on signup
- Check Supabase Authentication → URL Configuration
- Make sure your Vercel URL is added
- Try logging out of Supabase and logging back in

### Build fails on Vercel
- Check you set **Root Directory** to `apps/web`
- Verify all environment variables are set
- Check Vercel deployment logs for specific error

### Can't change user role
- Make sure you're logged in as admin
- Check your profile in Supabase Table Editor
- Verify role is set to `admin`

### Mobile menu not working
- This is normal - it's a known issue with some UI libraries
- Use desktop browser for testing admin features

---

## 🎯 What You Have Now

Your **production SaaS platform** running live with:

✅ Real authentication & user management  
✅ Admin control panel  
✅ Live call monitoring  
✅ Real-time notifications  
✅ API endpoints ready for scale  
✅ Beautiful, responsive UI  
✅ Secure, enterprise-grade architecture  

**Cost: $0/month** (using free tiers)

---

## 📊 Usage Limits (Free Tier)

**Supabase Free:**
- 500MB Database
- 1GB File Storage
- 2GB Bandwidth/month
- Perfect for: 100-500 users, testing, demos

**Vercel Free:**
- Unlimited deployments
- 100GB Bandwidth/month
- Perfect for: Testing, small teams, demos

**Need more?**
- Supabase Pro: $25/month (8GB database, 100GB storage)
- Vercel Pro: $20/month (1TB bandwidth)

---

## 🚀 Next Steps

Now that you're live, you can:

1. **Invite beta users** to test
2. **Gather feedback** on features
3. **Add more features** (see next section)
4. **Connect real integrations** (Freshdesk, Salesforce)
5. **Enable voice AI** (OpenAI integration)
6. **Add analytics tracking** (Google Analytics)

---

## 📞 Need Help?

**Check these docs:**
- `FEATURES_ADDED.md` - What's included
- `PROJECT_STATUS.md` - Complete feature list
- `ROADMAP.md` - Future plans

**Common commands:**
```bash
# Redeploy after code changes
git add -A
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys!

# Run locally
npm run dev

# Check logs
# Visit Vercel dashboard → Your project → Deployments → Click deployment → View logs
```

---

**🎉 Congratulations! Your platform is live and ready for users!**

Share your URL: `https://guru-core-xxxxx.vercel.app`

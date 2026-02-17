# ⚡ QUICK START - Get Live in 10 Minutes

## Step 1: Supabase Setup (5 min)

1. Go to [supabase.com](https://supabase.com) → Start your project
2. Create new project, wait for initialization
3. Go to SQL Editor → Paste `/packages/database/schema.sql` → Run
4. Go to Settings → API → Copy:
   - Project URL
   - anon public key
   - service_role key

## Step 2: Local Setup (3 min)

```bash
cd /Users/guru/Documents/aiagentguru/guru-core

# Create .env file
cat > .env << 'EOF'
SUPABASE_URL=YOUR_PROJECT_URL
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY
NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF

# Install and run
npm install
npm run dev
```

## Step 3: Create Admin (2 min)

1. Visit `http://localhost:3000/login`
2. Sign Up with your email
3. Go to Supabase Dashboard → Authentication → Users
4. Copy your user UUID
5. Go to Table Editor → profiles → Find your row
6. Change `role` to `admin` → Save
7. Refresh browser

## ✅ You're Live!

**Test these pages:**
- `/dashboard` - Overview
- `/live-calls` - Monitor calls in real-time
- `/admin` - Manage users
- Click the bell icon - See notifications

---

## 🚀 Deploy to Production (Optional)

```bash
npm i -g vercel
vercel
```

Add the same environment variables when prompted.

---

**That's it! Your enterprise SaaS platform is running! 🎉**

See `FEATURES_ADDED.md` for full details on what you can do.

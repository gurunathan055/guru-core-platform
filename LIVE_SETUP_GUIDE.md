# 🚀 SETUP GUIDE - Get Your Platform Running Live

This guide will help you deploy and run Guru-Core with real authentication, admin panel, and live call monitoring.

## Prerequisites

- Node.js 20+
- A Supabase account (free tier is fine)
- Git

## Step 1: Supabase Setup (5 minutes)

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project (choose a strong password)
4. Wait for project to initialize (~2 minutes)

### 1.2 Get Your Credentials

1. Go to Project Settings → API
2. Copy these values:
   - `Project URL` 
   - `anon/public key`
   - `service_role key` (keep this secret!)

### 1.3 Create Database Tables

1. Go to SQL Editor in Supabase dashboard
2. Copy the entire content from `/packages/database/schema.sql`
3. Paste and run it in SQL Editor
4. Verify tables are created in Table Editor

## Step 2: Local Environment Setup (3 minutes)

### 2.1 Clone and Install

```bash
cd /Users/guru/Documents/aiagentguru/guru-core
npm install
```

### 2.2 Configure Environment

Create `.env` file in the root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Step 3: Run Development Server (1 minute)

```bash
npm run dev
```

Visit: `http://localhost:3000`

## Step 4: Create Your First Admin User (2 minutes)

1. Go to `http://localhost:3000/login`
2. Click "Sign Up" tab
3. Fill in:
   - Name: Your Name
   - Email: admin@yourcompany.com
   - Company: Your Company
   - Password: (min 6 characters)
4. Click "Create Account"
5. You'll be redirected to the dashboard

### 4.1 Make Yourself an Admin

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user, copy the UUID
3. Go to Table Editor → profiles
4. Find your profile row
5. Change `role` from `viewer` to `admin`
6. Save
7. Refresh your browser

Now you have full admin access!

## Step 5: Test Features

### ✅ What's Working Now:

1. **Real Authentication**
   - Sign up / Login / Logout
   - Session management
   - Protected routes

2. **Admin Panel** (`/admin`)
   - View all users
   - Change user roles (admin/supervisor/viewer)
   - Delete users
   - System settings
   - Activity logs

3. **Live Call Monitoring** (`/live-calls`)
   - Real-time call dashboard
   - Active call list
   - Call details panel
   - Take over / Listen controls
   - Duration tracking
   - Sentiment & risk indicators

4. **Dashboard** (`/dashboard`)
   - Metrics from API
   - Recent calls
   - Charts

5. **Other Pages**
   - Analytics (8 interactive charts)
   - SOP Generator
   - Learning (autonomous)
   - Integrations
   - Knowledge Base
   - Settings

## Step 6: Invite Team Members

1. Go to `/admin`
2. Share signup link with team
3. After they sign up, change their role:
   - `admin`: Full access
   - `supervisor`: Manage calls, view analytics
   - `viewer`: Read-only access

## Next Steps for Production

### Option 1: Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow prompts and add your environment variables when asked.

### Option 2: Deploy to Your Server

1. Build for production:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

3. Use PM2 for process management:
```bash
npm i -g pm2
pm2 start npm --name "guru-core" -- start
pm2 save
```

## Troubleshooting

### Issue: "Invalid API key"
- Check your `.env` file
- Make sure you copied the correct keys from Supabase
- Restart the dev server

### Issue: "Table doesn't exist"
- Go to Supabase SQL Editor
- Run the schema.sql file again
- Check Table Editor to verify tables exist

### Issue: Can't login
- Check browser console for errors
- Verify Supabase project is active
- Check authentication is enabled in Supabase

### Issue: Pages redirect to login
- This is normal if not authenticated
- Sign up first, then login

## Features Still Using Mock Data

These features are fully built in the UI but don't have backend connections yet:

- **Voice AI calls** - Need OpenAI API + WebSocket server
- **RAG/Document processing** - Need Weaviate + Ollama running
- **Real integrations** - Need API keys for Freshdesk/Salesforce
- **File uploads** - Need Supabase Storage setup

## What's Next?

You now have:
- ✅ Real authentication working
- ✅ Admin panel to manage users
- ✅ Live call monitoring interface
- ✅ API endpoints serving data
- ✅ Full dashboard experience

### To Add More Features:

1. **Connect Real Integrations** - Add Freshdesk API keys
2. **Enable Voice AI** - Setup OpenAI Realtime API
3. **Add RAG** - Deploy Weaviate + Ollama with Docker
4. **Real-time Notifications** - Setup WebSocket server

## Cost Breakdown

**Current Setup: $0/month**
- Supabase Free Tier: 500MB database, 50MB storage
- Vercel Free Tier: Unlimited deployments
- All features work on free tier for testing!

**For Production:**
- Supabase Pro: $25/month (more resources)
- Vercel Pro: $20/month (if needed)
- OpenAI API: ~$20-100/month (for voice features)

---

## 🎉 Congratulations!

You now have a fully functional enterprise SaaS platform with:
- Multi-user authentication
- Role-based access control
- Admin management panel
- Live monitoring dashboard
- Analytics & reporting

**For support or questions:**
- Check the documentation in `/docs`
- Review `PROJECT_STATUS.md` for feature details
- See `ROADMAP.md` for future plans

---

**Built by Guru Team**

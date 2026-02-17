# Vercel Deployment Configuration

This is a monorepo managed by Turborepo. 

**IMPORTANT:** When deploying to Vercel, you MUST set the **Root Directory** to `apps/web` in the Vercel dashboard.

## Deployment Settings (Vercel Dashboard)

1. **Framework Preset:** Next.js
2. **Root Directory:** `apps/web` ⚠️ CRITICAL - SET THIS!
3. **Build Command:** `npm run build` (auto-detected)
4. **Output Directory:** `.next` (auto-detected)
5. **Install Command:** `npm install` (auto-detected)

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
SUPABASE_URL=https://jovacmaxufdluvdhppzy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFjbWF4dWZkbHV2ZGhwcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDI1NDMsImV4cCI6MjA4Njg3ODU0M30.ZIE336jo5dxACzl232A6GLQL3A0IOrH7ew_Nvni1b_I
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFjbWF4dWZkbHV2ZGhwcHp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMwMjU0MywiZXhwIjoyMDg2ODc4NTQzfQ.DdAdDVbf621XE_xPpedsCyl42l6mK-I9E0HCln_6f9Y
NEXT_PUBLIC_SUPABASE_URL=https://jovacmaxufdluvdhppzy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmFjbWF4dWZkbHV2ZGhwcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDI1NDMsImV4cCI6MjA4Njg3ODU0M30.ZIE336jo5dxACzl232A6GLQL3A0IOrH7ew_Nvni1b_I
```

## Why This Configuration?

This is a Turborepo monorepo with multiple workspaces:
- `/apps/web` - The Next.js application
- `/packages/*` - Shared packages

Vercel needs to build from the `/apps/web` directory where the Next.js app lives.

**DO NOT use `vercel.json` for monorepos - use the Vercel Dashboard Root Directory setting instead.**

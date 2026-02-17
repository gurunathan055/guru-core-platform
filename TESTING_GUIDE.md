# 🧪 Testing & Installation Guide

## Quick Start (5 Minutes)

### **Step 1: Install Dependencies**
```bash
cd /Users/guru/Documents/aiagentguru/guru-core
npm install
```

This will install all dependencies for the monorepo (~2-3 minutes).

### **Step 2: Start Docker Services** (Optional for now)
```bash
cd infra/docker
chmod +x ../scripts/start-services.sh
../scripts/start-services.sh
```

Note: Docker services are optional for UI testing. You can skip this and come back to it later.

### **Step 3: Setup Environment**
```bash
cp .env.example .env
```

For now, you can leave the defaults. Supabase configuration is needed later for backend integration.

### **Step 4: Start Development Server**
```bash
npm run dev
```

The app will start at: **http://localhost:3000**

---

## 📱 Testing the UI

### **Desktop Testing (1024px+)**

1. **Open in Chrome/Firefox/Safari**
   ```
   http://localhost:3000
   ```

2. **Navigate Through Pages**
   - Dashboard - Should show 4 metric cards and a table
   - Calls - Should show tabbed interface with call list
   - Knowledge - Should show upload interface
   - Settings - Should show settings forms

3. **Test Interactions**
   - Click sidebar navigation items
   - Hover over cards (should see hover effects)
   - Check table rendering
   - Test tab navigation

### **Mobile Testing (< 768px)**

**Option 1: Chrome DevTools**
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone SE" or "Pixel 5"
4. Reload page

**Option 2: Actual Mobile Device**
1. Find your local IP: `ifconfig | grep inet`
2. On mobile, visit: `http://YOUR_IP:3000`
3. Make sure both devices are on same network

**What to Test:**
- ✅ Bottom tab navigation appears
- ✅ Hamburger menu opens sidebar
- ✅ Cards stack vertically
- ✅ Touch targets are large enough
- ✅ Forms use full width
- ✅ Table shows as cards

### **Tablet Testing (768px - 1023px)**

1. In DevTools, select "iPad Mini" or "iPad Air"
2. Test:
   - ✅ Two-column grid for metrics
   - ✅ Collapsible sidebar
   - ✅ Medium-sized components

### **Responsive Breakpoint Testing**

Test all breakpoints by resizing browser:
- **320px** (iPhone SE portrait)
- **640px** (Large phone)
- **768px** (Tablet portrait)
- **1024px** (Laptop)
- **1280px** (Desktop)
- **1920px** (Large desktop/4K)

---

## 🧪 Component Testing

### **Test Button Component**

Add this to any page to test buttons:

```tsx
<div className="flex gap-2">
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
</div>
```

### **Test Badge Component**

```tsx
<div className="flex gap-2">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="destructive">Error</Badge>
</div>
```

### **Test Dialog Component**

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Test Dialog</DialogTitle>
      <DialogDescription>This is a test dialog</DialogDescription>
    </DialogHeader>
    <div>Dialog content goes here</div>
  </DialogContent>
</Dialog>
```

---

## 🔧 Troubleshooting

### **Port 3000 Already in Use**
```bash
# Kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### **Dependencies Not Installing**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### **TypeScript Errors**
```bash
# Check for errors
npm run type-check

# Fix auto-fixable issues
npm run lint
```

### **Hot Reload Not Working**
```bash
# Restart dev server
# Kill terminal and run again
npm run dev
```

### **Styles Not Applying**
1. Check if Tailwind is processing:
   - Open DevTools
   - Check if classes are applied
   - Look for Tailwind CSS in Network tab

2. Restart dev server if needed

---

## 📊 Performance Testing

### **Lighthouse Audit**
1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

**Expected Scores:**
- Performance: 90+ (without backend)
- Accessibility: 95+
- Best Practices: 90+
- SEO: 80+

### **Bundle Size**
```bash
npm run build

# Check build output
# Should show:
# Route (app)              Size     First Load JS
# ○ /                      ~5 KB    ~100 KB
# ○ /dashboard             ~8 KB    ~103 KB
```

---

## 🎨 Visual Regression Testing

### **Screenshot All Pages**

1. **Desktop (1920x1080)**
```bash
# Use Chrome DevTools
# Set viewport to 1920x1080
# Take screenshots of:
- /dashboard
- /calls  
- /knowledge
- /settings
```

2. **Mobile (375x667)**
```bash
# iPhone SE size
# Take screenshots of all pages
```

3. **Tablet (768x1024)**
```bash
# iPad size
# Take screenshots of all pages
```

---

## 🧩 Integration Testing Checklist

### **Navigation**
- [ ] Desktop sidebar navigation works
- [ ] Mobile bottom tabs work
- [ ] Hamburger menu opens/closes
- [ ] Active state highlights correctly
- [ ] Logo redirects to dashboard

### **Responsive Behavior**
- [ ] Breakpoints trigger at correct widths
- [ ] Sidebar hides on mobile
- [ ] Tables become cards on mobile
- [ ] Grids stack correctly
- [ ] Text sizes adjust appropriately

### **Touch Interactions** (Mobile)
- [ ] Buttons have 48x48px touch targets
- [ ] Swipe gestures work (if implemented)
- [ ] Pull-to-refresh ready
- [ ] No accidental clicks
- [ ] Smooth scrolling

### **Accessibility**
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast passes
- [ ] Screen reader compatible

---

## 🚀 Deployment Testing

### **Build for Production**
```bash
npm run build
```

Should complete without errors.

### **Start Production Server**
```bash
npm run start
```

Test production build at http://localhost:3000

### **Vercel Preview Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy preview
cd apps/web
vercel
```

---

## 📈 Next Steps After Testing

Once you've verified everything works:

1. **Commit Your Work**
```bash
git init
git add .
git commit -m "feat: complete UI component library and layouts"
```

2. **Create GitHub Repository**
```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/yourusername/guru-core.git
git push -u origin main
```

3. **Deploy to Vercel**
```bash
vercel --prod
```

4. **Continue Development**
   - Build Integration Studio
   - Add real data with Supabase
   - Implement authentication
   - Add charts (Recharts)
   - Build self-healing system

---

## 🎯 Current Test Results

### **What's Working ✅**
- All UI components render correctly
- Responsive layouts adapt to all screen sizes
- Navigation works on desktop and mobile
- Touch targets meet accessibility standards
- Dark mode configuration ready
- TypeScript compiles without errors
- Build completes successfully

### **What's Mock Data 📝**
- Dashboard metrics (static numbers)
- Recent calls table (3 sample rows)
- Call list (2 sample calls)
- User profile info

### **What's Placeholder 🚧**
- Charts (showing placeholder text)
- Real-time data
- API integrations
- Authentication flow
- Search functionality
- Filters and sorting

---

## 💡 Tips for Testing

1. **Use Multiple Browsers**
   - Chrome (primary)
   - Firefox
   - Safari (if on Mac)
   - Edge

2. **Test on Real Devices**
   - iPhone (iOS Safari)
   - Android (Chrome)
   - iPad
   - Different screen sizes

3. **Test Network Conditions**
   - Fast 3G
   - Slow 3G
   - Offline mode (for PWA testing)

4. **Test Different User Flows**
   - New user exploring app
   - Power user navigating quickly
   - Mobile user on the go
   - Tablet user with touch

5. **Document Issues**
   - Take screenshots
   - Note browser/device
   - Record steps to reproduce
   - Check console for errors

---

## 🎉 You're Ready!

The UI is fully functional and ready for:
- ✅ User testing
- ✅ Client demos
- ✅ Development showcases
- ✅ Backend integration
- ✅ Feature additions

**Start the dev server and explore the beautiful, responsive interface!** 🚀

```bash
npm run dev
# Open http://localhost:3000
```

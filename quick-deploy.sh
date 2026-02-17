#!/bin/bash

echo "🚀 Guru-Core Platform - Quick Deploy"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking Git status...${NC}"
git status --short
echo ""

echo -e "${BLUE}Step 2: Checking if changes need to be pushed...${NC}"
if [[ `git status --porcelain` ]]; then
    echo -e "${YELLOW}Uncommitted changes found. Committing...${NC}"
    git add -A
    read -p "Enter commit message: " commit_msg
    git commit -m "$commit_msg"
    git push origin main
    echo -e "${GREEN}✅ Changes pushed to GitHub${NC}"
else
    echo -e "${GREEN}✅ Everything up to date${NC}"
fi
echo ""

echo -e "${BLUE}Step 3: Checking local dev server...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Dev server is running${NC}"
else
    echo -e "${YELLOW}Dev server not running. Start with: npm run dev${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}🎉 Ready to Deploy!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Go to: https://vercel.com/new"
echo "2. Import repository: guru-core-platform"
echo "3. Set Root Directory: apps/web"
echo "4. Add environment variables"
echo "5. Click Deploy"
echo ""
echo "Your app will be live in 3-5 minutes!"
echo ""
echo "📖 Full guide: See ALL_FIXED_READY_TO_DEPLOY.md"
echo ""

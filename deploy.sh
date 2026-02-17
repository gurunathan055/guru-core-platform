#!/bin/bash

echo "🚀 Guru-Core Deployment Script"
echo "================================"
echo ""

# Check if git remote exists
if git remote get-url origin &> /dev/null; then
    echo "✅ Git remote already configured"
else
    echo "⚠️  No git remote found"
    echo ""
    echo "Please create a GitHub repository first:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a new repository (name: guru-core-platform)"
    echo "3. Copy the repository URL"
    echo ""
    read -p "Enter your GitHub repository URL: " REPO_URL
    git remote add origin "$REPO_URL"
    echo "✅ Git remote added"
fi

echo ""
echo "📦 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Click 'Add New...' → 'Project'"
    echo "3. Import your GitHub repository"
    echo "4. Set Root Directory to: apps/web"
    echo "5. Add environment variables (see .env.example)"
    echo "6. Click 'Deploy'"
    echo ""
    echo "📖 Full instructions: See DEPLOY_NOW.md"
else
    echo "❌ Failed to push to GitHub"
    echo "Please check your git configuration and try again"
fi

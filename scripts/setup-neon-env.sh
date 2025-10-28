#!/bin/bash
# Neon Environment Setup Script for Vercel Deployment
# This script helps you set up environment variables for Vercel deployment with Neon

echo "======================================"
echo "  Exam Prep App - Neon + Vercel Setup"
echo "======================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed"
    echo ""
    echo "Please install it first:"
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

echo "✓ Vercel CLI is installed"
echo ""

# Generate NEXTAUTH_SECRET
echo "Generating NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "✓ Generated: $NEXTAUTH_SECRET"
echo ""

# Prompt for NEXTAUTH_URL
echo "Enter your Vercel app URL (e.g., https://exam-prep-app.vercel.app):"
read -p "NEXTAUTH_URL: " NEXTAUTH_URL

if [ -z "$NEXTAUTH_URL" ]; then
    echo "❌ NEXTAUTH_URL is required"
    exit 1
fi

# Prompt for DATABASE_URL (pooled connection)
echo ""
echo "Enter your Neon DATABASE_URL (pooled connection recommended):"
echo "(Format: postgresql://user:pass@host/database?sslmode=require)"
read -p "DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is required"
    exit 1
fi

# Prompt for DIRECT_URL (optional)
echo ""
echo "Enter your Neon DIRECT_URL (for migrations, optional):"
read -p "DIRECT_URL (or press Enter to skip): " DIRECT_URL

# Prompt for GEMINI_API_KEY
echo ""
echo "Enter your Google Gemini API KEY:"
read -p "GEMINI_API_KEY: " GEMINI_API_KEY

if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ GEMINI_API_KEY is required"
    exit 1
fi

# Summary
echo ""
echo "======================================"
echo "  Summary of Environment Variables"
echo "======================================"
echo ""
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "DIRECT_URL: ${DIRECT_URL:-"Not set"}..."
echo "GEMINI_API_KEY: ${GEMINI_API_KEY:0:20}..."
echo ""

# Confirm
read -p "Do you want to add these variables to Vercel? (y/n) " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "Setup cancelled"
    exit 0
fi

# Function to add env variable
add_env_var() {
    local name=$1
    local value=$2
    local environment=$3
    
    echo "Adding $name to $environment..."
    echo "$value" | vercel env add "$name" "$environment" 2>&1 | grep -v "^$"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo "✓ $name added to $environment"
    else
        echo "❌ Failed to add $name to $environment"
    fi
    echo ""
}

# Add to production
echo ""
echo "=== Adding to Production ==="
echo ""
add_env_var "NEXTAUTH_URL" "$NEXTAUTH_URL" "production"
add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "production"
add_env_var "DATABASE_URL" "$DATABASE_URL" "production"
add_env_var "GEMINI_API_KEY" "$GEMINI_API_KEY" "production"

if [ -n "$DIRECT_URL" ]; then
    add_env_var "DIRECT_URL" "$DIRECT_URL" "production"
fi

# Add to preview
echo "=== Adding to Preview ==="
echo ""
add_env_var "NEXTAUTH_URL" "$NEXTAUTH_URL" "preview"
add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "preview"
add_env_var "DATABASE_URL" "$DATABASE_URL" "preview"
add_env_var "GEMINI_API_KEY" "$GEMINI_API_KEY" "preview"

if [ -n "$DIRECT_URL" ]; then
    add_env_var "DIRECT_URL" "$DIRECT_URL" "preview"
fi

# Ask about development
read -p "Do you want to add variables to development environment? (y/n) " ADD_DEV

if [ "$ADD_DEV" = "y" ] || [ "$ADD_DEV" = "Y" ]; then
    echo ""
    echo "=== Adding to Development ==="
    echo ""
    add_env_var "NEXTAUTH_URL" "http://localhost:3000" "development"
    add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "development"
    add_env_var "DATABASE_URL" "$DATABASE_URL" "development"
    add_env_var "GEMINI_API_KEY" "$GEMINI_API_KEY" "development"
    
    if [ -n "$DIRECT_URL" ]; then
        add_env_var "DIRECT_URL" "$DIRECT_URL" "development"
    fi
fi

echo ""
echo "======================================"
echo "✓ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Deploy your app: vercel --prod"
echo "2. Run migrations: npx prisma db push"
echo "3. Check deployment logs for any errors"
echo "4. Test authentication on your deployed app"
echo ""
echo "Note: Save your NEXTAUTH_SECRET somewhere safe!"
echo "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""


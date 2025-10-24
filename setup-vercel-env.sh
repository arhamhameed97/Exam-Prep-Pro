#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you set up all required environment variables for your exam-prep-app

echo "======================================"
echo "  Exam Prep App - Vercel ENV Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed${NC}"
    echo ""
    echo "Please install it first:"
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Vercel CLI is installed${NC}"
echo ""

# Generate NEXTAUTH_SECRET
echo -e "${BLUE}Generating NEXTAUTH_SECRET...${NC}"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}✓ Generated: ${NEXTAUTH_SECRET}${NC}"
echo ""

# Prompt for NEXTAUTH_URL
echo -e "${YELLOW}Enter your Vercel app URL (e.g., https://exam-prep-app.vercel.app):${NC}"
read -p "NEXTAUTH_URL: " NEXTAUTH_URL

if [ -z "$NEXTAUTH_URL" ]; then
    echo -e "${RED}❌ NEXTAUTH_URL is required${NC}"
    exit 1
fi

# Prompt for DATABASE_URL
echo ""
echo -e "${YELLOW}Enter your PostgreSQL DATABASE_URL:${NC}"
echo "(e.g., postgresql://user:pass@host:port/database)"
read -p "DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL is required${NC}"
    exit 1
fi

# Prompt for GEMINI_API_KEY
echo ""
echo -e "${YELLOW}Enter your Google Gemini API KEY:${NC}"
read -p "GEMINI_API_KEY: " GEMINI_API_KEY

if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}❌ GEMINI_API_KEY is required${NC}"
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
echo "GEMINI_API_KEY: ${GEMINI_API_KEY:0:20}..."
echo ""

# Confirm
read -p "Do you want to add these variables to Vercel? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo -e "${YELLOW}Setup cancelled${NC}"
    exit 0
fi

# Add variables to Vercel
echo ""
echo -e "${BLUE}Adding environment variables to Vercel...${NC}"
echo ""

# Function to add env variable
add_env_var() {
    local name=$1
    local value=$2
    local env=$3
    
    echo -e "${BLUE}Adding ${name} to ${env}...${NC}"
    echo "$value" | vercel env add "$name" "$env" --yes
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ ${name} added to ${env}${NC}"
    else
        echo -e "${RED}❌ Failed to add ${name} to ${env}${NC}"
    fi
    echo ""
}

# Add to production
echo -e "${GREEN}=== Adding to Production ===${NC}"
echo ""
add_env_var "NEXTAUTH_URL" "$NEXTAUTH_URL" "production"
add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "production"
add_env_var "DATABASE_URL" "$DATABASE_URL" "production"
add_env_var "GEMINI_API_KEY" "$GEMINI_API_KEY" "production"

# Add to preview
echo -e "${GREEN}=== Adding to Preview ===${NC}"
echo ""
add_env_var "NEXTAUTH_URL" "$NEXTAUTH_URL" "preview"
add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "preview"
add_env_var "DATABASE_URL" "$DATABASE_URL" "preview"
add_env_var "GEMINI_API_KEY" "$GEMINI_API_KEY" "preview"

# Add to development (optional)
read -p "Do you want to add variables to development environment? (y/n): " ADD_DEV

if [ "$ADD_DEV" = "y" ] || [ "$ADD_DEV" = "Y" ]; then
    echo ""
    echo -e "${GREEN}=== Adding to Development ===${NC}"
    echo ""
    add_env_var "NEXTAUTH_URL" "http://localhost:3000" "development"
    add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "development"
    add_env_var "DATABASE_URL" "$DATABASE_URL" "development"
    add_env_var "GEMINI_API_KEY" "$GEMINI_API_KEY" "development"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Redeploy your app: vercel --prod"
echo "2. Check deployment logs for any errors"
echo "3. Test authentication on your deployed app"
echo ""
echo -e "${YELLOW}Note: Save your NEXTAUTH_SECRET somewhere safe!${NC}"
echo "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""


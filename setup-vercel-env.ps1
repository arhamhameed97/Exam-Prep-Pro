# Vercel Environment Variables Setup Script (PowerShell)
# This script helps you set up all required environment variables for your exam-prep-app

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Exam Prep App - Vercel ENV Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✓ Vercel CLI is installed ($vercelVersion)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Vercel CLI is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install it first:" -ForegroundColor Yellow
    Write-Host "  npm install -g vercel" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Generate NEXTAUTH_SECRET
Write-Host "Generating NEXTAUTH_SECRET..." -ForegroundColor Blue
$NEXTAUTH_SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host "✓ Generated: $NEXTAUTH_SECRET" -ForegroundColor Green
Write-Host ""

# Prompt for NEXTAUTH_URL
Write-Host "Enter your Vercel app URL (e.g., https://exam-prep-app.vercel.app):" -ForegroundColor Yellow
$NEXTAUTH_URL = Read-Host "NEXTAUTH_URL"

if ([string]::IsNullOrWhiteSpace($NEXTAUTH_URL)) {
    Write-Host "❌ NEXTAUTH_URL is required" -ForegroundColor Red
    exit 1
}

# Prompt for DATABASE_URL
Write-Host ""
Write-Host "Enter your PostgreSQL DATABASE_URL:" -ForegroundColor Yellow
Write-Host "(e.g., postgresql://user:pass@host:port/database)" -ForegroundColor Gray
$DATABASE_URL = Read-Host "DATABASE_URL"

if ([string]::IsNullOrWhiteSpace($DATABASE_URL)) {
    Write-Host "❌ DATABASE_URL is required" -ForegroundColor Red
    exit 1
}

# Prompt for GEMINI_API_KEY
Write-Host ""
Write-Host "Enter your Google Gemini API KEY:" -ForegroundColor Yellow
$GEMINI_API_KEY = Read-Host "GEMINI_API_KEY"

if ([string]::IsNullOrWhiteSpace($GEMINI_API_KEY)) {
    Write-Host "❌ GEMINI_API_KEY is required" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Summary of Environment Variables" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXTAUTH_URL: $NEXTAUTH_URL"
Write-Host "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
Write-Host "DATABASE_URL: $($DATABASE_URL.Substring(0, [Math]::Min(30, $DATABASE_URL.Length)))..."
Write-Host "GEMINI_API_KEY: $($GEMINI_API_KEY.Substring(0, [Math]::Min(20, $GEMINI_API_KEY.Length)))..."
Write-Host ""

# Confirm
$CONFIRM = Read-Host "Do you want to add these variables to Vercel? (y/n)"

if ($CONFIRM -ne "y" -and $CONFIRM -ne "Y") {
    Write-Host "Setup cancelled" -ForegroundColor Yellow
    exit 0
}

# Function to add env variable
function Add-EnvVar {
    param (
        [string]$Name,
        [string]$Value,
        [string]$Environment
    )
    
    Write-Host "Adding $Name to $Environment..." -ForegroundColor Blue
    
    try {
        $Value | vercel env add $Name $Environment --yes 2>&1 | Out-Null
        Write-Host "✓ $Name added to $Environment" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to add $Name to $Environment" -ForegroundColor Red
    }
    Write-Host ""
}

# Add to production
Write-Host ""
Write-Host "=== Adding to Production ===" -ForegroundColor Green
Write-Host ""
Add-EnvVar -Name "NEXTAUTH_URL" -Value $NEXTAUTH_URL -Environment "production"
Add-EnvVar -Name "NEXTAUTH_SECRET" -Value $NEXTAUTH_SECRET -Environment "production"
Add-EnvVar -Name "DATABASE_URL" -Value $DATABASE_URL -Environment "production"
Add-EnvVar -Name "GEMINI_API_KEY" -Value $GEMINI_API_KEY -Environment "production"

# Add to preview
Write-Host "=== Adding to Preview ===" -ForegroundColor Green
Write-Host ""
Add-EnvVar -Name "NEXTAUTH_URL" -Value $NEXTAUTH_URL -Environment "preview"
Add-EnvVar -Name "NEXTAUTH_SECRET" -Value $NEXTAUTH_SECRET -Environment "preview"
Add-EnvVar -Name "DATABASE_URL" -Value $DATABASE_URL -Environment "preview"
Add-EnvVar -Name "GEMINI_API_KEY" -Value $GEMINI_API_KEY -Environment "preview"

# Add to development (optional)
$ADD_DEV = Read-Host "Do you want to add variables to development environment? (y/n)"

if ($ADD_DEV -eq "y" -or $ADD_DEV -eq "Y") {
    Write-Host ""
    Write-Host "=== Adding to Development ===" -ForegroundColor Green
    Write-Host ""
    Add-EnvVar -Name "NEXTAUTH_URL" -Value "http://localhost:3000" -Environment "development"
    Add-EnvVar -Name "NEXTAUTH_SECRET" -Value $NEXTAUTH_SECRET -Environment "development"
    Add-EnvVar -Name "DATABASE_URL" -Value $DATABASE_URL -Environment "development"
    Add-EnvVar -Name "GEMINI_API_KEY" -Value $GEMINI_API_KEY -Environment "development"
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Redeploy your app: vercel --prod"
Write-Host "2. Check deployment logs for any errors"
Write-Host "3. Test authentication on your deployed app"
Write-Host ""
Write-Host "Note: Save your NEXTAUTH_SECRET somewhere safe!" -ForegroundColor Yellow
Write-Host "NEXTAUTH_SECRET: $NEXTAUTH_SECRET" -ForegroundColor Cyan
Write-Host ""


# Vercel CLI Commands for Environment Variables

## Prerequisites

Install Vercel CLI if you haven't already:
```bash
npm install -g vercel
```

Login to Vercel:
```bash
vercel login
```

Link your project:
```bash
cd exam-prep-app
vercel link
```

## Quick Setup (Manual Commands)

### 1. Generate NEXTAUTH_SECRET

**Option A: Using OpenSSL**
```bash
openssl rand -base64 32
```

**Option B: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Using PowerShell (Windows)**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Save the output - you'll need it for the next steps!

### 2. Add Environment Variables

Replace the values with your actual data:

#### Production Environment

```bash
# NEXTAUTH_URL (Replace with your actual Vercel URL)
echo "https://exam-prep-app.vercel.app" | vercel env add NEXTAUTH_URL production

# NEXTAUTH_SECRET (Replace with generated secret)
echo "your-generated-secret-here" | vercel env add NEXTAUTH_SECRET production

# DATABASE_URL (Replace with your PostgreSQL connection string)
echo "postgresql://user:pass@host:port/database" | vercel env add DATABASE_URL production

# GEMINI_API_KEY (Replace with your Google Gemini API key)
echo "your-gemini-api-key" | vercel env add GEMINI_API_KEY production
```

#### Preview Environment

```bash
echo "https://exam-prep-app.vercel.app" | vercel env add NEXTAUTH_URL preview
echo "your-generated-secret-here" | vercel env add NEXTAUTH_SECRET preview
echo "postgresql://user:pass@host:port/database" | vercel env add DATABASE_URL preview
echo "your-gemini-api-key" | vercel env add GEMINI_API_KEY preview
```

#### Development Environment (Optional)

```bash
echo "http://localhost:3000" | vercel env add NEXTAUTH_URL development
echo "your-generated-secret-here" | vercel env add NEXTAUTH_SECRET development
echo "postgresql://user:pass@localhost:5432/dev_db" | vercel env add DATABASE_URL development
echo "your-gemini-api-key" | vercel env add GEMINI_API_KEY development
```

## Using the Automated Scripts

### For Mac/Linux (Bash):
```bash
chmod +x setup-vercel-env.sh
./setup-vercel-env.sh
```

### For Windows (PowerShell):
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup-vercel-env.ps1
```

## Verify Environment Variables

List all environment variables:
```bash
vercel env ls
```

Pull environment variables to local:
```bash
vercel env pull .env.local
```

## Remove Environment Variable (if needed)

```bash
vercel env rm VARIABLE_NAME production
vercel env rm VARIABLE_NAME preview
vercel env rm VARIABLE_NAME development
```

## Redeploy After Setting Variables

```bash
# Deploy to production
vercel --prod

# Or trigger a redeploy from dashboard
# Go to: https://vercel.com/dashboard → Your Project → Deployments → Redeploy
```

## Example Complete Setup

Here's a complete example with placeholder values:

```bash
# 1. Generate secret
SECRET=$(openssl rand -base64 32)
echo "Generated SECRET: $SECRET"

# 2. Set variables for production
echo "https://exam-prep-app.vercel.app" | vercel env add NEXTAUTH_URL production
echo "$SECRET" | vercel env add NEXTAUTH_SECRET production
echo "postgresql://postgres:mypass@containers-us-west-123.railway.app:5432/railway" | vercel env add DATABASE_URL production
echo "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" | vercel env add GEMINI_API_KEY production

# 3. Set variables for preview
echo "https://exam-prep-app.vercel.app" | vercel env add NEXTAUTH_URL preview
echo "$SECRET" | vercel env add NEXTAUTH_SECRET preview
echo "postgresql://postgres:mypass@containers-us-west-123.railway.app:5432/railway" | vercel env add DATABASE_URL preview
echo "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" | vercel env add GEMINI_API_KEY preview

# 4. Verify
vercel env ls

# 5. Deploy
vercel --prod
```

## Troubleshooting

### Command not found: vercel
```bash
npm install -g vercel
```

### Not logged in
```bash
vercel login
```

### Project not linked
```bash
vercel link
```

### Permission denied (Mac/Linux)
```bash
chmod +x setup-vercel-env.sh
```

### PowerShell execution policy error (Windows)
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Variables not taking effect
- Redeploy your application after setting variables
- Clear build cache in Vercel dashboard
- Check you're setting variables for the correct environment

## Tips

1. **Keep NEXTAUTH_SECRET safe** - Store it in a password manager
2. **Use the same NEXTAUTH_SECRET** across all environments for consistency
3. **NEXTAUTH_URL must start with https://** for production
4. **Test after deployment** - Try signing in/signing up
5. **Check logs** - View function logs in Vercel dashboard for errors

## Quick Reference Card

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Add variable
echo "value" | vercel env add VARIABLE_NAME environment

# List variables
vercel env ls

# Remove variable
vercel env rm VARIABLE_NAME environment

# Pull to local
vercel env pull .env.local

# Deploy
vercel --prod
```


# Environment Variables Setup Status

## ✅ Completed
- NEXTAUTH_URL: https://exam-prep-pro-dun.vercel.app
- NEXTAUTH_SECRET: r1oPXKYkPkw4HlJuXSe9veJ61Y0cuPthsk8lVkC1f8A=

## 🚨 Still Needed

You need to add these two environment variables:

### 1. DATABASE_URL
Your PostgreSQL connection string from Railway (or your database provider)

**Command:**
```bash
echo "postgresql://username:password@host:port/database" | vercel env add DATABASE_URL production
```

**Example format:**
```
postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

### 2. GEMINI_API_KEY
Your Google Gemini API key

**Command:**
```bash
echo "your-gemini-api-key" | vercel env add GEMINI_API_KEY production
```

**Example format:**
```
AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Quick Setup Commands

Run these commands in your terminal (replace with your actual values):

```bash
# Add DATABASE_URL (replace with your actual connection string)
echo "postgresql://postgres:yourpassword@yourhost:5432/yourdb" | vercel env add DATABASE_URL production

# Add GEMINI_API_KEY (replace with your actual API key)
echo "your-actual-gemini-api-key" | vercel env add GEMINI_API_KEY production

# Verify all variables are set
vercel env ls

# Redeploy to apply changes
vercel --prod
```

## Where to Get These Values

### DATABASE_URL
1. Go to Railway dashboard
2. Select your PostgreSQL database
3. Go to "Connect" tab
4. Copy the "Postgres Connection URL"

### GEMINI_API_KEY
1. Go to Google AI Studio: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key

## After Adding Variables

1. **Verify:** `vercel env ls`
2. **Redeploy:** `vercel --prod`
3. **Test:** Visit your app and try signing up/signing in

## Current Status
- ✅ Project linked to Vercel
- ✅ NEXTAUTH_URL set
- ✅ NEXTAUTH_SECRET set
- 🚨 DATABASE_URL needed
- 🚨 GEMINI_API_KEY needed

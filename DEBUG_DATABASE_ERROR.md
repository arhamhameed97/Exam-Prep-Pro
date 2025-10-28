# Debugging the Prisma Database Connection Error

Your error: `the URL must start with the protocol prisma://` indicates that Prisma can't find a valid DATABASE_URL at runtime.

## Common Causes & Solutions

### 1. Environment Variables Not Applied to Current Deployment

**Issue**: Variables were added after the deployment was created.

**Solution**:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click the **⋯** menu on the latest deployment
3. Select **Redeploy**
4. OR: Make a small change and push to trigger a new deployment

### 2. Wrong Environment Variable Name

**Issue**: Variable is named incorrectly (typo, wrong case, etc.)

**Check in Vercel**:
- Go to Settings → Environment Variables
- Verify it's exactly: `DATABASE_URL` (not `database_url`, `DATABASE_URLS`, etc.)

### 3. Variable Not Set for Your Environment

**Issue**: Variable is only set for one environment (e.g., Production) but app is in Preview.

**Check in Vercel**:
1. Settings → Environment Variables
2. Make sure `DATABASE_URL` is added to:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

### 4. Variable Value Has Quotes or Formatting Issues

**Issue**: The value includes extra quotes or formatting.

**Example of WRONG**:
```
Value: "postgresql://user:pass@host/db"
```

**Example of CORRECT**:
```
Value: postgresql://user:pass@host/db
```

### 5. Neon Connection String Format

Your Neon connection string should look like:

```
postgresql://neondb_owner:[YOUR-PASSWORD]@[ENDPOINT].neon.tech/neondb?sslmode=require
```

For connection pooling (recommended):
```
postgresql://neondb_owner:[PASSWORD]@[POOL-ENDPOINT].pooler.supabase.com/neondb?sslmode=require
```

**Get this from**: Neon Console → Your Project → Connection Details

### 6. Build vs Runtime Environment Mismatch

**Issue**: Build succeeded but runtime can't access variables.

**Solution**: 
1. Check if variables are in the **Build** section vs **Runtime** section
2. They should be in **Runtime**

## How to Verify Variables Are Set

### Option 1: Check Vercel Logs

After redeploying with the debug code, check logs for:
```
⚠️ DATABASE_URL is not set!
```

If you see this, the variable is definitely missing.

### Option 2: Add a Debug API Route

Create `src/app/api/debug-env/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set (hidden)' : 'NOT SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'NOT SET',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
  })
}
```

Then visit: `https://your-app.vercel.app/api/debug-env` to see what's set.

## Quick Fix Checklist

- [ ] Verified `DATABASE_URL` exists in Vercel Settings → Environment Variables
- [ ] Verified it's set for Production, Preview, AND Development
- [ ] Verified the value has NO quotes (just the connection string)
- [ ] Verified connection string format is correct (starts with `postgresql://`)
- [ ] Redeployed after adding variables
- [ ] Checked build logs for any errors

## After Following Steps Above

1. **Redeploy** your app
2. **Test** the signup route
3. **Check logs** for the debug message

If you still see the error, share:
- Screenshot of your Vercel Environment Variables settings
- The format of your DATABASE_URL (first few characters)
- Latest deployment logs

## Alternative: Test with Vercel CLI

You can also test locally with Vercel environment variables:

```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Pull environment variables
vercel env pull .env.local

# Check what was pulled
cat .env.local | grep DATABASE_URL
```

This will download the actual variables Vercel is using.

## Still Not Working?

If none of this helps, the issue might be:

1. **Prisma version mismatch**: Try updating Prisma
2. **Cached build**: Clear Vercel build cache
3. **Function-specific issue**: One API route works but another doesn't

Let me know what you find in the logs after redeploying!


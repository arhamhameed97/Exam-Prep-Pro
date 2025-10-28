# Setting Up Environment Variables in Vercel

Your app is deployed but can't connect to the database because environment variables are missing.

## Quick Fix - Add Environment Variables

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Find your project: `exam-prep-app` or similar
3. Click on the project

### Step 2: Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Click **Add New** for each variable below

### Step 3: Add These Variables

Add them for **All Environments** (Production, Preview, Development):

#### 1. DATABASE_URL
```
postgresql://neondb_owner:[YOUR-PASSWORD]@[YOUR-HOST].neon.tech/neondb?sslmode=require
```
**Get this from:** Neon Console → Your Project → Connection Details

#### 2. NEXTAUTH_SECRET
Generate a secure secret (run this locally):
```bash
openssl rand -base64 32
```
Then paste the output as the value.

#### 3. NEXTAUTH_URL
```
https://exam-prep-p7u1una0d-arhamhameed97-5321s-projects.vercel.app
```
Update with your actual Vercel deployment URL.

#### 4. GEMINI_API_KEY
```
[YOUR-GOOGLE-AI-API-KEY]
```
Get this from: https://ai.google.dev/

### Step 4: Redeploy

After adding variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**

Or trigger a new deployment by:
- Pushing a commit to GitHub, OR
- Click **Redeploy** button

## Alternative: Use the Setup Script

You can use the PowerShell script to automate this:

```powershell
# Make sure you have Vercel CLI installed
npm install -g vercel

# Run the setup script
.\scripts\setup-neon-env.ps1
```

This will prompt you for all the values and add them to Vercel automatically.

## Verify Setup

After redeploying, check your logs:
1. Go to **Deployments** → Latest deployment
2. Click **View Function Logs**
3. Make sure you don't see "Please set these variables in your Vercel dashboard"

## Get Your Neon Connection String

1. Go to https://console.neon.tech
2. Select your project
3. Go to **Connection Details**
4. Choose **Connection Pooling** (recommended for Vercel)
5. Copy the connection string

It should look like:
```
postgresql://username:password@ep-[xxx].pooler.supabase.com/dbname?sslmode=require
```

Or for direct connection:
```
postgresql://username:password@ep-[xxx].us-east-2.aws.neon.tech/dbname?sslmode=require
```

## Important Notes

- **DATABASE_URL** should use Neon's pooled connection for better performance
- **NEXTAUTH_SECRET** must be set and consistent across environments
- **NEXTAUTH_URL** must exactly match your Vercel deployment URL
- All variables must be added to Production, Preview, AND Development environments

## Still Having Issues?

### Error: "the URL must start with the protocol prisma://"

This means `DATABASE_URL` is not set or is empty.

**Fix:** Make sure DATABASE_URL is added to all environments in Vercel.

### Error: Database connection timeout

**Fix:** 
1. Check your Neon connection string is correct
2. Try using a direct connection (non-pooled) if pooled fails
3. Check Neon dashboard for any connection issues

### Authentication not working

**Fix:**
1. Verify `NEXTAUTH_URL` matches your Vercel URL exactly
2. Make sure `NEXTAUTH_SECRET` is set
3. Clear browser cookies and try again

## Next Steps After Setup

Once environment variables are set:

1. **Redeploy** your application
2. **Run database migrations**:
   ```bash
   npx prisma db push
   ```
3. **Test the app**:
   - Visit your Vercel URL
   - Try signing up
   - Try signing in
   - Create a subject
   - Generate a test

## Environment Variables Summary

| Variable | Example | Where to Get |
|----------|---------|--------------|
| DATABASE_URL | `postgresql://...` | Neon Console |
| DIRECT_URL | `postgresql://...` | Neon Console (optional) |
| NEXTAUTH_SECRET | `[random base64]` | Generate with `openssl rand -base64 32` |
| NEXTAUTH_URL | `https://your-app.vercel.app` | Your Vercel deployment URL |
| GEMINI_API_KEY | `AIza...` | Google AI Studio |

---

**After setting these variables, your app should work! 🚀**


# Quick Deploy to Vercel with Neon

## Step-by-Step Deployment Instructions

### Step 1: Prepare Neon Database Connection Strings

You need TWO connection strings from your Neon dashboard:

#### For DATABASE_URL (Connection Pooling)
From Neon dashboard, use the **pooled connection** endpoint:
```
postgresql://neondb_owner:[YOUR-PASSWORD]@[POOL-ENDPOINT].neon.tech/neondb?sslmode=require
```

This connection string should include `?sslmode=require` at minimum.

#### For DIRECT_URL (Optional but recommended)
Use your **direct connection** endpoint (for migrations):
```
postgresql://neondb_owner:[YOUR-PASSWORD]@[DIRECT-ENDPOINT].neon.tech/neondb?sslmode=require
```

> **Tip**: In Neon dashboard, look for the "Connection pooling" section to get the pooled endpoint.

### Step 2: Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output - you'll need it as your `NEXTAUTH_SECRET`.

### Step 3: Deploy to Vercel

#### Option A: Using GitHub Integration (Recommended)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment with Neon"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/login
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   - Before clicking "Deploy", expand "Environment Variables"
   - Add all variables for Production, Preview, and Development:
     
     ```
     DATABASE_URL
     NEXTAUTH_SECRET
     NEXTAUTH_URL (use placeholder first, update after deploy)
     GEMINI_API_KEY
     DIRECT_URL (optional, for migrations)
     ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Note your deployment URL (e.g., `https://exam-prep-app.vercel.app`)

5. **Update NEXTAUTH_URL**:
   - Go to Settings → Environment Variables
   - Update `NEXTAUTH_URL` with your actual Vercel URL
   - Redeploy if needed

#### Option B: Using Vercel CLI

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   vercel link
   ```

4. **Set environment variables**:
   ```bash
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_URL production
   vercel env add GEMINI_API_KEY production
   ```

   Repeat for `preview` and `development` environments.

5. **Deploy**:
   ```bash
   vercel --prod
   ```

### Step 4: Run Database Migrations

After deployment, run migrations on your Neon database:

```bash
# Set environment variable locally
export DATABASE_URL="your-neon-pooled-connection-string"

# Or use the direct connection for migrations
export DATABASE_URL="your-neon-direct-connection-string"

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Or if you have migrations:
npx prisma migrate deploy
```

### Step 5: Verify Deployment

1. Visit your Vercel URL
2. Test sign up/sign in
3. Create a subject
4. Generate a test
5. Check for any errors in Vercel logs

### Step 6: Monitor Your Deployment

- View logs: Vercel Dashboard → Project → Logs
- Check build logs for any errors
- Monitor API usage in Neon dashboard
- Track costs in Vercel dashboard

## Troubleshooting

### Build Fails on Prisma

**Error**: `Error: Can't find binary` or `Prisma schema not found`

**Solution**: Ensure these build env vars are set in Vercel:
```
PRISMA_GENERATE_DATAPROXY=false
PRISMA_CLI_BINARY_TARGETS=native,rhel-openssl-3.0.x
PRISMA_CLIENT_ENGINE_TYPE=binary
```

These should be set automatically by `vercel.json`.

### Database Connection Timeout

**Error**: `P1001: Can't reach database server`

**Solution**: 
- Verify connection string is correct
- Ensure SSL mode is `require`
- Try using pooled connection instead of direct
- Check Neon dashboard for any quotas/limits

### Authentication Not Working

**Error**: Can't sign in, redirects fail

**Solution**:
- Verify `NEXTAUTH_URL` matches your Vercel domain exactly
- Check `NEXTAUTH_SECRET` is set correctly
- Ensure database has been migrated (Session table exists)

## Next Steps

After successful deployment:

1. ✅ Configure custom domain (optional)
2. ✅ Set up GitHub integration for auto-deploy
3. ✅ Add monitoring (Sentry, etc.)
4. ✅ Configure CDN cache headers
5. ✅ Set up preview deployments for PRs

## Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs exam-prep-app

# Redeploy
vercel --prod

# Prisma commands
npx prisma studio  # Open database GUI
npx prisma db pull # Pull schema from database
npx prisma migrate dev # Create new migration
```

## Environment Variables Reference

| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| `DATABASE_URL` | `postgresql://...` | ✅ Yes | Neon pooled connection |
| `DIRECT_URL` | `postgresql://...` | ⚠️ Optional | Neon direct connection (for migrations) |
| `NEXTAUTH_SECRET` | Random base64 | ✅ Yes | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://app.vercel.app` | ✅ Yes | Your Vercel deployment URL |
| `GEMINI_API_KEY` | `AI...` | ✅ Yes | From Google AI Studio |

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- This app's logs: Vercel Dashboard → Your Project → Logs


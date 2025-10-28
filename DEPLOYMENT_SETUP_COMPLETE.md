# Deployment Setup Complete ✓

Your app has been configured for deployment to Vercel with a Neon PostgreSQL database.

## What Has Been Configured

### 1. **Prisma Configuration**
- ✅ Added `directUrl` support for Neon migrations
- ✅ Binary targets configured for Vercel serverless environment
- ✅ Optimized for Neon connection pooling

### 2. **Vercel Configuration**
- ✅ `vercel.json` configured with proper build settings
- ✅ Prisma binary targets specified
- ✅ API route optimizations for serverless
- ✅ Security headers configured

### 3. **Prisma Client**
- ✅ Updated for serverless optimization
- ✅ Connection pooling ready for Neon
- ✅ Proper singleton pattern for Vercel

### 4. **Documentation**
- ✅ Created `DEPLOYMENT.md` with comprehensive guide
- ✅ Created `scripts/deploy-to-vercel.md` with step-by-step instructions
- ✅ Created PowerShell setup script for Windows
- ✅ Created bash setup script for Unix/Linux
- ✅ Updated README with deployment section

## Next Steps

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Configure for Vercel + Neon deployment"
git push origin main
```

### Step 2: Link to Vercel

**Option A: Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Continue to Step 3

**Option B: Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel link
```

### Step 3: Set Environment Variables

**Using the automated script:**
```bash
# On Windows (PowerShell)
.\scripts\setup-neon-env.ps1

# On Unix/Linux (Bash)
bash scripts/setup-neon-env.sh
```

**Or manually in Vercel Dashboard:**
1. Go to your project → Settings → Environment Variables
2. Add these variables for Production, Preview, and Development:

```env
DATABASE_URL=postgresql://[YOUR-NEON-CONNECTION-STRING]
NEXTAUTH_SECRET=[GENERATE WITH: openssl rand -base64 32]
NEXTAUTH_URL=https://your-app.vercel.app
GEMINI_API_KEY=[YOUR-GEMINI-KEY]
DIRECT_URL=postgresql://[YOUR-NEON-DIRECT-CONNECTION]  # Optional
```

### Step 4: Deploy

**From Dashboard:**
- Click "Deploy" in Vercel dashboard

**From CLI:**
```bash
vercel --prod
```

### Step 5: Run Database Migrations

After deployment, connect to your Neon database and run:

```bash
# Set your DATABASE_URL environment variable
export DATABASE_URL="your-neon-connection-string"

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

### Step 6: Update NEXTAUTH_URL

After deployment, Vercel will give you a URL like `https://exam-prep-app.vercel.app`

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Update `NEXTAUTH_URL` to your actual Vercel deployment URL
3. Redeploy if necessary

### Step 7: Test Your Deployment

Visit your Vercel URL and verify:
- ✅ Sign up/Sign in works
- ✅ Subjects can be created
- ✅ Tests can be generated
- ✅ No errors in Vercel logs

## Important Notes

### Neon Connection Strings

You need **TWO** connection strings from Neon:

1. **Pooled Connection** (for `DATABASE_URL`):
   - Use the connection pooler endpoint
   - Better for serverless/Vercel
   - Example: `postgresql://user@pool-endpoint/db?sslmode=require`

2. **Direct Connection** (for `DIRECT_URL`, optional):
   - Use the direct endpoint
   - Only needed for migrations
   - Example: `postgresql://user@direct-endpoint/db?sslmode=require`

### Environment Variables Reference

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | ✅ Yes | Neon pooled connection |
| `DIRECT_URL` | ⚠️ Optional | Neon direct connection (migrations) |
| `NEXTAUTH_SECRET` | ✅ Yes | Auth secret (generate randomly) |
| `NEXTAUTH_URL` | ✅ Yes | Your Vercel deployment URL |
| `GEMINI_API_KEY` | ✅ Yes | Google AI API key |

### Troubleshooting

**Build fails:**
- Check Prisma binary targets in `vercel.json`
- Verify environment variables are set correctly

**Database connection errors:**
- Verify connection string format
- Check SSL mode is `require`
- Try direct connection if pooled fails

**Authentication not working:**
- Verify `NEXTAUTH_URL` matches Vercel URL exactly
- Check `NEXTAUTH_SECRET` is set
- Ensure database has been migrated

## Helpful Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod

# Prisma commands
npx prisma studio     # Open database GUI
npx prisma db pull    # Pull schema from database
npx prisma generate   # Generate Prisma Client
```

## Documentation

- Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Step-by-step instructions: [scripts/deploy-to-vercel.md](./scripts/deploy-to-vercel.md)
- Environment setup script: [scripts/setup-neon-env.ps1](./scripts/setup-neon-env.ps1)

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma + Serverless: https://www.prisma.io/docs/guides/deployment/deploying-to-vercel

---

**You're all set! Follow the steps above to deploy your app.** 🚀


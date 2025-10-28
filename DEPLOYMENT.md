# Deployment Guide - Vercel + Neon

This guide will help you deploy the Exam Prep App to Vercel with a Neon PostgreSQL database.

## Prerequisites

- ✅ Neon database already set up (you have the connection string)
- ✅ Vercel account created
- ✅ Repository on GitHub
- ✅ Google Gemini API key

## Environment Variables

You need to set these environment variables in Vercel:

### Required Variables

```bash
# Database - Use your Neon connection string
# For connection pooling (recommended): postgresql://user:password@host/database?sslmode=require&connection_limit=1
# For direct connection: postgresql://user:password@host/database?sslmode=require
DATABASE_URL="postgresql://neondb_owner:[YOUR-PASSWORD]@[YOUR-ENDPOINT].neon.tech/[YOUR-DATABASE]?sslmode=require"

# NextAuth Configuration
# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

# Your Vercel deployment URL (will be something like https://exam-prep-app.vercel.app)
NEXTAUTH_URL="https://exam-prep-app.vercel.app"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key-here"
```

## Deployment Steps

### 1. Link Your GitHub Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository (`exam-prep-app`)
4. Vercel will detect it's a Next.js project automatically

### 2. Configure Environment Variables

Before deploying, add environment variables:

1. In your Vercel project settings, go to "Environment Variables"
2. Add the following for each environment (Production, Preview, Development):
   - `DATABASE_URL` - Your Neon connection string
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Vercel URL
   - `GEMINI_API_KEY` - Your Google AI key

### 3. Deploy to Vercel

1. Click "Deploy" in the Vercel dashboard
2. Vercel will automatically:
   - Install dependencies
   - Run `npm run vercel-build` (which includes Prisma generation)
   - Build the Next.js application
   - Deploy to production

### 4. Run Database Migrations

After first deployment, run migrations on your Neon database:

```bash
# Set your DATABASE_URL
export DATABASE_URL="your-neon-connection-string"

# Generate Prisma Client
npx prisma generate

# Push schema to database (for initial setup)
npx prisma db push

# OR if you have migrations (recommended)
npx prisma migrate deploy
```

### 5. Configure Neon Connection Pooling (Optional but Recommended)

For better performance with serverless functions:

1. In your Neon dashboard, enable connection pooling
2. Update your `DATABASE_URL` in Vercel to use the pooled connection:
   ```
   postgresql://user:password@pooler-endpoint/database?sslmode=require&pgbouncer=true&connection_limit=1
   ```

### 6. Update NEXTAUTH_URL

After deployment, update `NEXTAUTH_URL` in Vercel to match your actual Vercel domain.

### 7. Test Your Deployment

Visit your Vercel URL and test:
- ✅ Authentication (sign up/sign in)
- ✅ Subject creation
- ✅ Test generation
- ✅ Database operations

## Troubleshooting

### Build Errors

If you encounter Prisma build errors:
- Ensure `PRISMA_GENERATE_DATAPROXY` is set to `false` in build env
- Check that binary targets match in `prisma/schema.prisma`

### Database Connection Issues

- Verify connection string is correct
- Check if connection pooling is enabled
- Ensure SSL mode is `require`
- Test connection locally first

### Authentication Issues

- Verify `NEXTAUTH_URL` matches your Vercel domain
- Check `NEXTAUTH_SECRET` is set correctly
- Ensure database sessions table exists

## Post-Deployment

1. Update your README with production URL
2. Configure custom domain (optional)
3. Set up monitoring and analytics
4. Enable preview deployments for pull requests

## Useful Commands

```bash
# Deploy to Vercel from CLI
vercel --prod

# Check build locally
npm run build

# Test database connection
npx prisma db pull

# View database in Prisma Studio
npx prisma studio
```

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Neon Documentation: https://neon.tech/docs
- Prisma + Serverless: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel


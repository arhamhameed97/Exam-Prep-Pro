# Prisma + Vercel Deployment Fix

## Issue
`PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "rhel-openssl-3.0.x"`

## Solutions Applied

### 1. Prisma Schema Configuration
Added binary targets in `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

### 2. Next.js Configuration
- Removed `output: 'standalone'` which can cause Prisma bundling issues
- Simplified webpack configuration for better compatibility

### 3. Vercel Configuration
Added `includeFiles` to ensure Prisma client is bundled with functions:
```json
"functions": {
  "src/app/api/**/*.ts": {
    "maxDuration": 30,
    "includeFiles": "node_modules/.prisma/client/**"
  }
}
```

### 4. Build Process
Ensured `prisma generate` runs before every build:
```json
"scripts": {
  "build": "prisma generate && next build",
  "vercel-build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
```

## Additional Steps (If Issue Persists)

### Clear Vercel Build Cache
1. Go to Vercel Dashboard → Your Project
2. Go to Settings → General
3. Scroll to "Build & Development Settings"
4. Clear build cache and redeploy

### Verify Environment Variables
Make sure these are set in Vercel:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your Vercel app URL
- `NEXTAUTH_SECRET` - Secret key for NextAuth
- `GEMINI_API_KEY` - Google Gemini API key

## Troubleshooting

### If Prisma error persists:
1. Clear Vercel build cache (most common fix)
2. Redeploy from scratch
3. Check build logs for `prisma generate` output
4. Verify database connection string is correct

### Alternative: Use Prisma Data Proxy
If issues persist, consider using Prisma Accelerate/Data Proxy:
https://www.prisma.io/docs/accelerate

## Build Verification
After deployment, check:
1. Build logs show `✔ Generated Prisma Client`
2. No errors during `prisma generate`
3. Query engine binaries are included in deployment

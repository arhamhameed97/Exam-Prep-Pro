# NextAuth URL Setup for Vercel Deployment

## Step-by-Step Guide

### 1. Find Your Vercel App URL

After deploying to Vercel, your app will have a URL in one of these formats:

**Production URL (Recommended):**
```
https://exam-prep-app.vercel.app
```

**Alternative formats:**
```
https://your-project-name.vercel.app
https://your-project-name-username.vercel.app
```

### 2. Set NEXTAUTH_URL in Vercel Dashboard

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your `exam-prep-app` project
3. Navigate to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add the following:

```
Name: NEXTAUTH_URL
Value: https://exam-prep-app.vercel.app
Environment: Production, Preview, Development
```

#### Option B: Via Vercel CLI
```bash
vercel env add NEXTAUTH_URL production
# Enter: https://exam-prep-app.vercel.app

vercel env add NEXTAUTH_URL preview  
# Enter: https://exam-prep-app.vercel.app

vercel env add NEXTAUTH_URL development
# Enter: http://localhost:3000
```

### 3. Generate NEXTAUTH_SECRET

Generate a secure secret key:

**Using OpenSSL (Recommended):**
```bash
openssl rand -base64 32
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Online Generator:**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

### 4. Set NEXTAUTH_SECRET in Vercel

Add the generated secret to Vercel:

```
Name: NEXTAUTH_SECRET
Value: [your-generated-secret-here]
Environment: Production, Preview, Development
```

### 5. Complete Environment Variables Checklist

Make sure ALL these variables are set in Vercel:

```env
# NextAuth Configuration
NEXTAUTH_URL=https://exam-prep-app.vercel.app
NEXTAUTH_SECRET=your-32-character-secret-key

# Database
DATABASE_URL=postgresql://user:pass@host:port/database

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Optional
NODE_ENV=production
```

### 6. Verify Your Setup

After setting environment variables:

1. **Redeploy** your app (or it will auto-deploy on next push)
2. **Check deployment logs** for any errors
3. **Test authentication** by signing up/signing in
4. **Verify** no "Missing NEXTAUTH_URL" errors in logs

### 7. Finding Your Vercel URL

If you don't know your Vercel URL yet:

1. Deploy your app to Vercel
2. Go to your Vercel dashboard
3. Click on your project
4. You'll see the URL at the top (e.g., `exam-prep-app.vercel.app`)
5. Use `https://` + that domain as your NEXTAUTH_URL

### 8. Custom Domain (Optional)

If you're using a custom domain:

```env
NEXTAUTH_URL=https://yourdomain.com
```

Make sure to:
- Configure the domain in Vercel settings
- Wait for DNS propagation
- Update NEXTAUTH_URL to match your custom domain

## Common Issues & Solutions

### Issue: "Missing NEXTAUTH_URL" error
**Solution:** Set the environment variable in Vercel dashboard and redeploy

### Issue: Authentication not working
**Solution:** 
- Verify NEXTAUTH_URL exactly matches your deployment URL
- Ensure it starts with `https://` (not `http://`)
- Check NEXTAUTH_SECRET is set
- Clear Vercel build cache and redeploy

### Issue: Different URL for preview/production
**Solution:** 
- Set NEXTAUTH_URL for both Production and Preview environments
- Production can use your main domain
- Preview can use the same or a different URL

## Example Configuration

For an app deployed at `https://exam-prep-app.vercel.app`:

```env
# Production
NEXTAUTH_URL=https://exam-prep-app.vercel.app
NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pq==
DATABASE_URL=postgresql://postgres:pass@host.railway.app:5432/railway
GEMINI_API_KEY=AIzaSyB...

# Development (Local)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pq==
DATABASE_URL=postgresql://postgres:pass@localhost:5432/dev_db
GEMINI_API_KEY=AIzaSyB...
```

## Quick Setup Script

After deploying to Vercel, run these commands:

```bash
# Generate secret
SECRET=$(openssl rand -base64 32)
echo "Your NEXTAUTH_SECRET: $SECRET"

# Add to Vercel (replace YOUR_URL with your actual Vercel URL)
vercel env add NEXTAUTH_URL production
# Paste: https://YOUR_URL.vercel.app

vercel env add NEXTAUTH_SECRET production  
# Paste: $SECRET value from above

# Redeploy
vercel --prod
```

## Verification Checklist

- [ ] NEXTAUTH_URL is set in Vercel
- [ ] NEXTAUTH_URL starts with `https://`
- [ ] NEXTAUTH_URL matches your actual deployment URL
- [ ] NEXTAUTH_SECRET is set (32+ characters)
- [ ] DATABASE_URL is configured
- [ ] GEMINI_API_KEY is set
- [ ] App has been redeployed after setting variables
- [ ] No "Missing environment variables" errors in logs
- [ ] Sign in/Sign up works correctly

## Support

If you continue to have issues:
1. Check Vercel function logs
2. Verify all environment variables are set for correct environments
3. Clear build cache and redeploy
4. Check that your PostgreSQL database is accessible from Vercel


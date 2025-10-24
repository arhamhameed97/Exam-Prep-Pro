# Quick Environment Variables Setup for Vercel

## 🚨 URGENT: Set These Environment Variables in Vercel

The build is failing because `NEXTAUTH_URL` is missing. Here's how to fix it:

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your `exam-prep-app` project
3. Go to **Settings** tab
4. Click **Environment Variables**

### Step 2: Add Required Variables

Add these **exact** environment variables:

```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=your-postgresql-connection-string
GEMINI_API_KEY=your-gemini-api-key
```

### Step 3: Get Your App URL
- Your app URL is: `https://exam-prep-app.vercel.app` (or similar)
- Replace `your-app-name` with your actual Vercel app name

### Step 4: Generate NEXTAUTH_SECRET
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

### Step 5: Redeploy
After setting the environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Example Environment Variables

```env
NEXTAUTH_URL=https://exam-prep-app.vercel.app
NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ⚠️ Important Notes

- Set variables for **Production**, **Preview**, AND **Development** environments
- Make sure there are **no spaces** around the `=` sign
- Don't include quotes around the values
- Click **Save** after adding each variable

## After Setting Variables

The build should succeed and authentication will work properly!

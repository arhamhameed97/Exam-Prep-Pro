# 🚨 DATABASE_URL Error - Need Your Railway Database URL

## ❌ Current Error:
```
Error validating datasource `db`: the URL must start with the protocol `prisma://`
```

This error occurs because the `DATABASE_URL` environment variable is missing or set to a placeholder value.

## 🔧 Solution: Add Your Railway Database URL

You need to add your actual Railway PostgreSQL database URL to Vercel.

### Step 1: Get Your Railway Database URL

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your PostgreSQL database project
3. Go to the **"Connect"** tab
4. Copy the **"Postgres Connection URL"** (it should look like this):
   ```
   postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
   ```

### Step 2: Add to Vercel

Run this command with your actual Railway URL:

```bash
# Replace with your actual Railway database URL
echo "postgresql://postgres:yourpassword@yourhost:5432/yourdb" | vercel env add DATABASE_URL production
```

**Example:**
```bash
echo "postgresql://postgres:abc123@containers-us-west-123.railway.app:5432/railway" | vercel env add DATABASE_URL production
```

### Step 3: Add Other Required Variables

```bash
# Add Gemini API key (get from https://makersuite.google.com/app/apikey)
echo "your-actual-gemini-api-key" | vercel env add GEMINI_API_KEY production

# Add encryption key (already generated)
echo "158b41a2894918d961bb265850dcba8e139167f22051599fd34bcd69b5bc4345" | vercel env add NEXT_PUBLIC_ENCRYPTION_KEY production

# Add AI model
echo "gemini-2.0-flash" | vercel env add AI_MODEL production
```

### Step 4: Verify and Redeploy

```bash
# Check all variables are set
vercel env ls

# Redeploy to apply changes
vercel --prod
```

## 🎯 What You Need:

1. **Railway Database URL** - Get from Railway dashboard
2. **Gemini API Key** - Get from Google AI Studio
3. **Run the commands above** with your actual values

## 📍 Where to Find:

- **Railway Database URL:** Railway Dashboard → Your PostgreSQL → Connect tab
- **Gemini API Key:** [Google AI Studio](https://makersuite.google.com/app/apikey)

Once you add your actual `DATABASE_URL`, the signup error will be resolved! 🚀

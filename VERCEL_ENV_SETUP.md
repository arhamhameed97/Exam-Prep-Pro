# Vercel Environment Variables Setup

## Required Environment Variables

Set these environment variables in your Vercel dashboard under **Settings > Environment Variables**:

### 1. Database Configuration
```
DATABASE_URL=postgresql://username:password@host:port/database_name
```
- Get this from your Railway PostgreSQL database
- Format: `postgresql://user:pass@host:port/dbname`

### 2. NextAuth Configuration
```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
```
- `NEXTAUTH_URL`: Your Vercel app URL (replace `your-app-name` with your actual app name)
- `NEXTAUTH_SECRET`: Generate a secure random string (32+ characters)

### 3. Google Gemini AI
```
GEMINI_API_KEY=your-gemini-api-key
```
- Get this from Google AI Studio
- Required for AI-powered test generation

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** tab
4. Click **Environment Variables**
5. Add each variable with the correct name and value
6. Make sure to set them for **Production**, **Preview**, and **Development** environments
7. Click **Save**

## Generate NEXTAUTH_SECRET

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Database Setup

1. **Railway Database**: Make sure your PostgreSQL database is running
2. **Connection String**: Use the DATABASE_URL from Railway
3. **Prisma Migration**: The app will automatically run `prisma generate` during build

## Troubleshooting

### Common Issues:
- **500 errors**: Usually missing environment variables
- **Database connection**: Check DATABASE_URL format
- **NextAuth errors**: Verify NEXTAUTH_URL and NEXTAUTH_SECRET
- **AI generation fails**: Check GEMINI_API_KEY

### Testing Environment Variables:
After setting up, redeploy your app. The build logs will show if environment variables are properly configured.

## Example Environment Variables

```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
NEXTAUTH_URL=https://exam-prep-app.vercel.app
NEXTAUTH_SECRET=your-32-character-secret-key-here
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

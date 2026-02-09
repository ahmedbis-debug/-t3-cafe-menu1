# AWS Amplify Deployment Guide for T/3 Coffee Menu

## Step-by-Step Setup

### Step 1: Go to AWS Amplify Console
1. Visit: https://console.aws.amazon.com/amplify
2. Click **"Create app"** → **"Host web app"**
3. Select **GitHub** as your repository service
4. Click **"Authorize AWS"** (if prompted)

### Step 2: Connect Your Repository
1. Select repository: **ahmedbis-debug/-t3-cafe-menu1**
2. Select branch: **main**
3. Click **"Next"**

### Step 3: Configure Build Settings
The build settings should auto-populate. Make sure they look like this:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
    build:
      commands:
        - pnpm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
backend:
  phases:
    build:
      commands:
        - echo "Backend build complete"
```

Click **"Next"**

### Step 4: Add Environment Variables

This is the most important step. Click **"Add environment variable"** for each of these:

#### **Required Variables** (Must have these)

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_APP_ID` | `t3-cafe-menu` | Fixed value |
| `OAUTH_SERVER_URL` | `https://api.manus.im` | Fixed value |
| `VITE_OAUTH_PORTAL_URL` | `https://auth.manus.im` | Fixed value |
| `BUILT_IN_FORGE_API_URL` | `https://api.manus.im/forge` | Fixed value |
| `VITE_FRONTEND_FORGE_API_URL` | `https://api.manus.im/forge` | Fixed value |
| `VITE_ANALYTICS_ENDPOINT` | `https://analytics.manus.im` | Fixed value |
| `VITE_APP_TITLE` | `T/3 Coffee Menu` | Your app name |
| `DATABASE_URL` | `mysql://user:pass@host/db` | **Get from Manus** |
| `JWT_SECRET` | `your-secret-key` | **Get from Manus** |
| `BUILT_IN_FORGE_API_KEY` | `your-api-key` | **Get from Manus** |
| `VITE_FRONTEND_FORGE_API_KEY` | `your-frontend-key` | **Get from Manus** |
| `VITE_ANALYTICS_WEBSITE_ID` | `your-website-id` | **Get from Manus** |
| `OWNER_NAME` | `Your Name` | Your name |
| `OWNER_OPEN_ID` | `your-open-id` | **Get from Manus** |

#### **How to Get Manus Secrets**

You need to find these values from your Manus project:

1. **DATABASE_URL**: Your MySQL connection string
   - Format: `mysql://username:password@hostname:port/database`
   - Get this from your Manus database settings

2. **JWT_SECRET**: A random secret key
   - Can be any long random string
   - Example: `abc123def456ghi789jkl`

3. **BUILT_IN_FORGE_API_KEY**: Your Manus API key
   - Find in Manus Settings → Secrets/API Keys

4. **VITE_FRONTEND_FORGE_API_KEY**: Your frontend API key
   - Find in Manus Settings → Secrets/API Keys

5. **VITE_ANALYTICS_WEBSITE_ID**: Your analytics ID
   - Find in Manus Settings → Analytics

6. **OWNER_OPEN_ID**: Your Manus user ID
   - Find in Manus Settings → Account/Profile

### Step 5: Deploy

1. Click **"Save and deploy"**
2. Amplify will start building your app
3. Wait 5-10 minutes for deployment to complete
4. You'll get a live URL: `https://main.d1234567890.amplifyapp.com`

---

## Troubleshooting

### Build Fails with "Database connection error"
- Make sure `DATABASE_URL` is correct
- Check that your database is accessible from AWS

### "API Key not found" error
- Verify `BUILT_IN_FORGE_API_KEY` is correct
- Check it hasn't expired in Manus

### App loads but no data shows
- Check all environment variables are set correctly
- Verify `OAUTH_SERVER_URL` and `VITE_OAUTH_PORTAL_URL`

---

## Next Steps

1. Get the Manus secrets from your project settings
2. Add all environment variables to Amplify
3. Deploy
4. Test your live app
5. (Optional) Add a custom domain

Good luck! 🚀

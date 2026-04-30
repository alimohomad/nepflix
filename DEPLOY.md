# Deploying Nepflix to Vercel

## Quick Deploy

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/nepflix.git
git push -u origin main
```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration
   - Click "Deploy"

3. **Set Environment Variable:**
   - Go to Project Settings → Environment Variables
   - Add: `SECRET_KEY` = `your-secret-key-here`
   - Redeploy

## Manual Deploy (Vercel CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add SECRET_KEY

# Deploy to production
vercel --prod
```

## After Deployment

Your app will be live at: `https://your-project.vercel.app`

Update the API URLs in:
- `nepflix.html` (line ~242): Change `https://nepflix.eu.cc/api/` to your Vercel URL
- `api/dashboard.html` (line ~120): Change API_URL to your Vercel URL

Example:
```javascript
const API_URL = "https://your-project.vercel.app/api/visitors";
```

## API Endpoints

After deployment, your endpoints will be:
- `https://your-project.vercel.app/` - Main Nepflix app
- `https://your-project.vercel.app/api/` - Target URL API
- `https://your-project.vercel.app/api/update?url=...&key=...` - Update target
- `https://your-project.vercel.app/api/visitors?action=count` - Visitor count
- `https://your-project.vercel.app/api/dashboard.html` - Live dashboard

## Testing

```bash
# Test target API
curl https://your-project.vercel.app/api/

# Test visitor count
curl https://your-project.vercel.app/api/visitors?action=count

# Update target URL
curl "https://your-project.vercel.app/api/update?url=https://newsite.com&key=your-secret-key"
```

## Troubleshooting

**404 Error:**
- Make sure `vercel.json` is in the root directory
- Check that `api/server.js` exists
- Verify the build completed successfully

**Environment Variables:**
- Set `SECRET_KEY` in Vercel dashboard
- Redeploy after adding variables

**File Persistence:**
- Note: Vercel serverless functions use `/tmp` storage
- Data resets on cold starts
- For production, consider using a database (MongoDB, Redis, etc.)

## Alternative: Use Database

For persistent storage, replace file operations with a database:

**MongoDB Atlas (Free):**
```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);
```

**Redis (Upstash Free):**
```javascript
const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
});
```

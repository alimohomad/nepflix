# Nepflix API Server (Node.js)

Node.js/Express API server for Nepflix target URL management and visitor tracking.

## Installation

1. Install dependencies:
```bash
cd api
npm install
```

2. Configure environment (optional):
```bash
cp .env.example .env
# Edit .env and set your SECRET_KEY
```

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Target URL Management

**GET /api/**
- Returns current target URL
- Response: `url=https://target-site.com`

**GET /api/update**
- Updates target URL
- Parameters:
  - `url` - New target URL (required)
  - `key` - Secret API key (required)
- Example: `/api/update?url=https://newsite.com&key=your-secret-key`

### Visitor Tracking

**GET /api/visitors?action=ping&id=visitor_id**
- Sends visitor heartbeat
- Returns active visitor count and visitor ID

**GET /api/visitors?action=count**
- Returns current active visitor count
- No authentication required

**GET /api/visitors?action=list&key=your-secret-key**
- Returns detailed visitor list
- Requires API key authentication

### Dashboard

**GET /api/dashboard.html**
- Live traffic monitoring dashboard
- Real-time visitor statistics

## Configuration

Set your secret key in `.env` file or directly in `server.js`:
```javascript
const secretKey = process.env.SECRET_KEY || 'your-secret-key-here';
```

## Deployment

### Deploy to any Node.js hosting:

**Heroku:**
```bash
heroku create nepflix-api
git push heroku main
```

**Vercel:**
```bash
vercel deploy
```

**Railway:**
```bash
railway up
```

**VPS/Server:**
```bash
# Install PM2 for process management
npm install -g pm2

# Start server
pm2 start server.js --name nepflix-api

# Auto-restart on reboot
pm2 startup
pm2 save
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `SECRET_KEY` - API authentication key

## File Structure

- `server.js` - Main API server
- `target.txt` - Stores current target URL
- `visitors.json` - Stores active visitor data
- `dashboard.html` - Live traffic dashboard

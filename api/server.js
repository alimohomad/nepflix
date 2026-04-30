// Nepflix API Server - Node.js/Express
// Optimized for Vercel serverless deployment

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File paths - use /tmp for serverless environments
const isVercel = process.env.VERCEL === '1';
const dataDir = isVercel ? '/tmp' : __dirname;
const TARGET_FILE = path.join(dataDir, 'target.txt');
const VISITORS_FILE = path.join(dataDir, 'visitors.json');

// Initialize files if they don't exist
function initFiles() {
    if (!fs.existsSync(TARGET_FILE)) {
        fs.writeFileSync(TARGET_FILE, 'https://graph.vshield.pro');
    }
    if (!fs.existsSync(VISITORS_FILE)) {
        fs.writeFileSync(VISITORS_FILE, JSON.stringify({ visitors: [] }));
    }
}

initFiles();

// ========================================
// TARGET URL API
// ========================================

// GET / or /api/ - Returns current target URL
app.get(['/', '/api/', '/api'], (req, res) => {
    try {
        const currentTarget = fs.readFileSync(TARGET_FILE, 'utf8').trim();
        
        // Return in parameter format: url=https://anything.com
        res.type('text/plain');
        res.send(`url=${encodeURIComponent(currentTarget)}`);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read target', success: false });
    }
});

// GET /api/update - Updates target URL
app.get(['/update', '/api/update'], (req, res) => {
    const { url, key } = req.query;
    const secretKey = process.env.SECRET_KEY || 'your-secret-key-here'; // Change this!
    
    // Validate API key
    if (key !== secretKey) {
        return res.status(401).json({ error: 'Unauthorized', success: false });
    }
    
    // Validate URL
    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL', success: false });
    }
    
    try {
        fs.writeFileSync(TARGET_FILE, url);
        res.json({
            success: true,
            url: url,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save', success: false });
    }
});

// ========================================
// VISITOR TRACKING API
// ========================================

const VISITOR_TIMEOUT = 30; // seconds

// Clean up inactive visitors
function cleanupVisitors(visitors) {
    const currentTime = Math.floor(Date.now() / 1000);
    return visitors.filter(visitor => {
        return (currentTime - visitor.lastSeen) < VISITOR_TIMEOUT;
    });
}

// GET /api/visitors - Visitor tracking endpoint
app.get(['/visitors', '/api/visitors'], (req, res) => {
    const { action, id, key } = req.query;
    const currentTime = Math.floor(Date.now() / 1000);
    
    try {
        // Read current visitors
        let data = JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf8'));
        if (!data.visitors) data = { visitors: [] };
        
        // Clean up inactive visitors
        data.visitors = cleanupVisitors(data.visitors);
        
        if (action === 'ping') {
            // Visitor heartbeat - update or add visitor
            const visitorId = id || `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const userAgent = req.headers['user-agent'] || 'Unknown';
            const ip = req.ip || req.connection.remoteAddress || 'Unknown';
            
            // Update existing or add new visitor
            let found = false;
            for (let visitor of data.visitors) {
                if (visitor.id === visitorId) {
                    visitor.lastSeen = currentTime;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                data.visitors.push({
                    id: visitorId,
                    ip: ip,
                    userAgent: userAgent.substring(0, 100),
                    firstSeen: currentTime,
                    lastSeen: currentTime
                });
            }
            
            // Save updated data
            fs.writeFileSync(VISITORS_FILE, JSON.stringify(data));
            
            res.json({
                success: true,
                visitorId: visitorId,
                activeVisitors: data.visitors.length,
                timestamp: currentTime
            });
            
        } else if (action === 'count') {
            // Just return current visitor count
            res.json({
                success: true,
                activeVisitors: data.visitors.length,
                timestamp: currentTime
            });
            
        } else if (action === 'list') {
            // Return detailed visitor list (admin only)
            const secretKey = process.env.SECRET_KEY || 'your-secret-key-here';
            
            if (key !== secretKey) {
                return res.status(401).json({ error: 'Unauthorized', success: false });
            }
            
            // Return full visitor details
            const visitors = data.visitors.map(v => ({
                id: v.id.substring(0, 16) + '...',
                ip: v.ip,
                duration: currentTime - v.firstSeen,
                lastActive: currentTime - v.lastSeen
            }));
            
            res.json({
                success: true,
                activeVisitors: data.visitors.length,
                visitors: visitors,
                timestamp: currentTime
            });
            
        } else {
            res.status(400).json({ error: 'Invalid action', success: false });
        }
        
    } catch (error) {
        console.error('Visitor tracking error:', error);
        res.status(500).json({ error: 'Server error', success: false });
    }
});

// Serve static dashboard
app.get('/api/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// Start server (only for local development)
if (!isVercel) {
    app.listen(PORT, () => {
        console.log(`🚀 Nepflix API Server running on port ${PORT}`);
        console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard.html`);
        console.log(`🎯 Target API: http://localhost:${PORT}/api/`);
        console.log(`👥 Visitors API: http://localhost:${PORT}/api/visitors`);
    });
}

// Export for Vercel serverless
module.exports = app;

// Example API endpoint (Node.js/Express)
// This shows how to create an API that returns the target URL

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// In-memory storage (use database in production)
let currentTarget = {
    target: "https://graph.vshield.pro",
    updatedAt: new Date().toISOString()
};

// GET endpoint - Returns current target URL
app.get('/get-target', (req, res) => {
    res.json(currentTarget);
});

// POST endpoint - Updates target URL (admin only)
app.post('/update-target', (req, res) => {
    const { target, apiKey } = req.body;
    
    // Simple API key validation (use proper auth in production)
    if (apiKey !== 'your-secret-key') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!target || !target.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid target URL' });
    }
    
    currentTarget = {
        target: target,
        updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, ...currentTarget });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});

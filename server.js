const express = require('express');
const path = require('path');
const app = express();

// Load environment variables from .env file
require('dotenv').config();
const apiKey = process.env.API_KEY;
const port = process.env.PORT;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

// Endpoint to serve the API key
app.get('/api/key', (req, res) => {
    res.json({ apiKey });
});

// Handle requests to the root URL by serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running...`);
});

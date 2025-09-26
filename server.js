const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.API_BASE_URL || "http://localhost:8080", "https://api.reactivewings.com"]
    }
  }
}));

// CORS configuration
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
//   credentials: true
// }));

// Other middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes for HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API proxy routes (optional - you can remove if using direct backend calls)
// These routes can proxy to your actual backend server
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

// Proxy middleware function
const proxyRequest = async (req, res, endpoint, method = 'GET') => {
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      }
    };

    if (method !== 'GET' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.text();
    
    res.status(response.status);
    res.set(response.headers);
    res.send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// API routes (proxy to backend)
app.get('/api/users/user-info', (req, res) => {
  proxyRequest(req, res, '/users/user-info', 'GET');
});

app.get('/api/flights/search', (req, res) => {
  const { airlineCode, flightNumber, scheduledDate } = req.query;
  const endpoint = `/flights/search?airlineCode=${airlineCode}&flightNumber=${flightNumber}&scheduledDate=${scheduledDate}`;
  proxyRequest(req, res, endpoint, 'GET');
});

app.post('/api/users/subscribe', (req, res) => {
  proxyRequest(req, res, '/users/subscribe', 'POST');
});

app.post('/api/users/unsubscribe', (req, res) => {
  const { airlineCode, flightNumber, scheduledDate } = req.query;
  const endpoint = `/users/unsubscribe?airlineCode=${airlineCode}&flightNumber=${flightNumber}&scheduledDate=${scheduledDate}`;
  proxyRequest(req, res, endpoint, 'POST');
});

app.post('/api/logout', (req, res) => {
  proxyRequest(req, res, '/logout', 'POST');
});

app.get('/api/oauth2/authorization/google', (req, res) => {
  res.redirect(`${API_BASE_URL}/oauth2/authorization/google`);
});

// Configuration endpoint for frontend
app.get('/config.json', (req, res) => {
  res.json({
    API_BASE_URL: API_BASE_URL,
    SERVER_URL: process.env.SERVER_URL || `http://localhost:${PORT}`,
    NODE_ENV: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html')); // Redirect to home page for SPA behavior
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ReactiveWings Frontend Server running on port ${PORT}`);
  const serverUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
  console.log(`📍 Home page: ${serverUrl}`);
  console.log(`📊 Dashboard: ${serverUrl}/dashboard`);
  console.log(`💓 Health check: ${serverUrl}/health`);
  console.log(`🔗 Backend API: ${API_BASE_URL}`);
});

module.exports = app;
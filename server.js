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
      connectSrc: (() => {
        const baseApiUrl = process.env.API_BASE_URL || "http://localhost:8080";
        const allowedSources = [
          "'self'",
          baseApiUrl,
          "https://api.reactivewings.com"
        ];
        
        // Always add both HTTP and HTTPS versions for flexibility
        if (baseApiUrl.startsWith('http://')) {
          allowedSources.push(baseApiUrl.replace('http://', 'https://'));
        } else if (baseApiUrl.startsWith('https://')) {
          allowedSources.push(baseApiUrl.replace('https://', 'http://'));
        }
        
        return [...new Set(allowedSources)]; // Remove duplicates
      })()
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

// API Base URL for OAuth redirect
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';


// Keep only OAuth redirect (required for Google OAuth flow)
app.get('/api/oauth2/authorization/google', (req, res) => {
  res.redirect(`${API_BASE_URL}/oauth2/authorization/google`);
});

// Remove all other API routes - frontend will call backend directly with JWT tokens

// Handle OAuth callback with token
app.get('/auth/callback', (req, res) => {
  const token = req.query.token;
  if (token) {
    // Redirect to dashboard with token parameter
    res.redirect(`/dashboard?token=${encodeURIComponent(token)}`);
  } else {
    // Redirect to home page if no token
    res.redirect('/?error=auth_failed');
  }
});

// Configuration endpoint for frontend
app.get('/config.json', (req, res) => {
  // Auto-detect server URL based on request headers (useful for Vercel)
  const getServerUrl = () => {
    if (process.env.SERVER_URL) {
      return process.env.SERVER_URL;
    }
    
    // For Vercel deployment, auto-detect from request
    if (req.headers.host && req.headers.host.includes('vercel.app')) {
      return `https://${req.headers.host}`;
    }
    
    // Default fallback
    return `http://localhost:${PORT}`;
  };
  
  const config = {
    API_BASE_URL: API_BASE_URL,
    SERVER_URL: getServerUrl(),
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
  
  console.log('Serving config.json:', config);
  console.log('Environment API_BASE_URL:', process.env.API_BASE_URL);
  console.log('Request host:', req.headers.host);
  
  res.json(config);
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
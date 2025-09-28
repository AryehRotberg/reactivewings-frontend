const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL;

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
        
        if (baseApiUrl.startsWith('http://')) {
          allowedSources.push(baseApiUrl.replace('http://', 'https://'));
        } else if (baseApiUrl.startsWith('https://')) {
          allowedSources.push(baseApiUrl.replace('https://', 'http://'));
        }
        
        return [...new Set(allowedSources)];
      })()
    }
  }
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

const proxyRequest = async (req, res, endpoint, method = 'GET') => {
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `${API_BASE_URL}${endpoint}`;
    
    if (req.headers.authorization) {
      console.log(`🔐 JWT token present for ${method} ${endpoint}: ${req.headers.authorization.substring(0, 20)}...`);
    } else {
      console.log(`⚠️  No Authorization header for ${method} ${endpoint}`);
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    
    if (req.headers['x-requested-with']) {
      headers['X-Requested-With'] = req.headers['x-requested-with'];
    }
    
    const options = {
      method: method,
      headers: headers
    };

    if (method !== 'GET' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    console.log(`➡️ Proxying ${method} ${url}`);
    console.log(`📋 Headers:`, JSON.stringify(headers, null, 2));
    
    const response = await fetch(url, options);
    
    if (endpoint.includes('user-info') || endpoint.includes('oauth2') || endpoint.includes('login') || endpoint.includes('logout')) {
      console.log(`🔐 Auth response: ${response.status} for ${endpoint}`);
    }
    
    res.status(response.status);
    
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      const safeName = key.toLowerCase();
      if (!['connection', 'transfer-encoding', 'content-encoding', 'content-length'].includes(safeName)) {
        responseHeaders[key] = value;
      }
    });
    
    Object.entries(responseHeaders).forEach(([key, value]) => {
      try {
        res.set(key, value);
      } catch (e) {
        console.log(`⚠️  Skipped header ${key}: ${e.message}`);
      }
    });
    
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      const data = await response.text();
      res.send(data);
    }
    
  } catch (error) {
    console.error('Proxy error for', endpoint, ':', error.message);
    console.error('Full error:', error);
    console.error('Target URL was:', url);
    console.error('Environment API_BASE_URL:', process.env.API_BASE_URL);
    console.error('Runtime API_BASE_URL:', API_BASE_URL);
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      endpoint: endpoint,
      targetUrl: url,
      environmentApiUrl: process.env.API_BASE_URL
    });
  }
};

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

app.get('/auth/callback', (req, res) => {
  const token = req.query.token;
  if (token) {
    res.redirect(`/dashboard?token=${encodeURIComponent(token)}`);
  } else {
    res.redirect('/?error=auth_failed');
  }
});

app.get('/config.json', (req, res) => {
  const getServerUrl = () => {
    if (process.env.SERVER_URL) {
      return process.env.SERVER_URL;
    }
    
    if (req.headers.host && req.headers.host.includes('vercel.app')) {
      return `https://${req.headers.host}`;
    }
    
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

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((_, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ReactiveWings Frontend Server running on port ${PORT}`);
  const serverUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
  console.log(`📍 Home page: ${serverUrl}`);
  console.log(`📊 Dashboard: ${serverUrl}/dashboard`);
  console.log(`💓 Health check: ${serverUrl}/health`);
  console.log(`🔗 Backend API: ${API_BASE_URL}`);
});

module.exports = app;

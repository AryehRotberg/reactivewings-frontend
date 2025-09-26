# ReactiveWings Frontend Node.js Server

A Node.js Express server for serving the ReactiveWings Flight Subscription Manager frontend application.

## Features

- ✅ **Static File Serving**: Serves HTML, CSS, JavaScript, and assets
- ✅ **API Proxy**: Optional proxy to backend API endpoints  
- ✅ **Security**: Helmet.js for security headers, CORS configuration
- ✅ **Performance**: Compression middleware, static file caching
- ✅ **Development**: Hot reload with nodemon, logging with morgan
- ✅ **Health Checks**: Built-in health check endpoint
- ✅ **Environment Configuration**: Configurable via environment variables

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy and modify the `.env` file to customize your configuration:

```bash
# Copy the example environment file
cp .env .env.local

# Edit your local configuration
# The server will work with defaults if no .env file is present
```

### 3. Start the Server

**Development Mode (with hot reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Available Endpoints

### Web Pages
- `GET /` - Home page (index.html)
- `GET /dashboard` - Dashboard page (dashboard.html)

### API Proxy Endpoints (Optional)
- `GET /api/users/user-info` - Get user information
- `GET /api/flights/search` - Search for flights
- `POST /api/users/subscribe` - Subscribe to flight updates
- `POST /api/users/unsubscribe` - Unsubscribe from flight updates
- `POST /api/logout` - User logout
- `GET /api/oauth2/authorization/google` - Google OAuth redirect

### System Endpoints
- `GET /health` - Health check endpoint

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `API_BASE_URL` | `http://localhost:8080` | Backend API base URL |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins (comma-separated) |

### Frontend Configuration

The frontend can be configured to use either:

1. **Direct Backend Calls** (default): Frontend directly calls the backend API
2. **Proxy Mode**: Frontend calls go through this Node.js server

To enable proxy mode, modify `js/config.js`:

```javascript
const CONFIG = {
    USE_PROXY: true, // Change to true for proxy mode
    // ... other settings
};
```

## Project Structure

```
reactivewings-frontend/
├── server.js              # Main server file
├── package.json          # Dependencies and scripts
├── .env                  # Environment configuration
├── index.html            # Home page
├── dashboard.html        # Dashboard page
├── css/                  # Stylesheets
├── js/                   # JavaScript modules
│   ├── config.js         # Frontend configuration
│   ├── dashboard/        # Dashboard-specific modules
│   └── home/            # Home page modules
└── assets/              # Static assets
```

## Development

### Adding New Routes

To add new routes, modify `server.js`:

```javascript
// Add a new page route
app.get('/new-page', (req, res) => {
  res.sendFile(path.join(__dirname, 'new-page.html'));
});

// Add a new API proxy route
app.get('/api/new-endpoint', (req, res) => {
  proxyRequest(req, res, '/new-endpoint', 'GET');
});
```

### Static File Organization

Static files are served from their respective directories:
- `/css/*` → `css/` directory
- `/js/*` → `js/` directory  
- `/assets/*` → `assets/` directory

### Security

The server includes several security features:

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Content Security Policy**: Restricts resource loading
- **Input validation**: JSON and URL-encoded body parsing limits

### Error Handling

- **404 Errors**: Redirects to home page (SPA behavior)
- **500 Errors**: Returns JSON error response
- **Proxy Errors**: Handles backend API communication failures

## Backend Integration

This server is designed to work with the ReactiveWings backend API. The backend should be running on the configured `API_BASE_URL` (default: `http://localhost:8080`).

### Backend Requirements

The backend should provide these endpoints:
- `GET /users/user-info`
- `GET /flights/search`
- `POST /users/subscribe`
- `POST /users/unsubscribe`
- `POST /logout`
- `GET /oauth2/authorization/google`

## Deployment

### Production Deployment

1. Set environment variables:
   ```bash
   export NODE_ENV=production
   export PORT=3000
   export API_BASE_URL=https://your-backend-api.com
   ```

2. Install production dependencies:
   ```bash
   npm ci --only=production
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t reactivewings-frontend .
docker run -p 3000:3000 reactivewings-frontend
```

## Monitoring

### Health Checks

Use the health endpoint to monitor server status:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 3600
}
```

### Logging

The server uses Morgan for HTTP request logging. Logs include:
- Request method and URL
- Response status and time
- User agent and referrer
- Response size

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   Error: listen EADDRINUSE: address already in use :::3000
   ```
   Solution: Change the PORT environment variable or kill the process using the port.

2. **Backend API connection failed**
   ```bash
   Proxy error: fetch failed
   ```
   Solution: Verify the backend is running on the configured `API_BASE_URL`.

3. **Static files not loading**
   - Check file paths in HTML files
   - Verify files exist in the correct directories
   - Check browser console for 404 errors

### Debug Mode

Enable detailed logging by setting:
```bash
DEBUG=express:* npm run dev
```

## License

MIT License - see backend repository for full license details.
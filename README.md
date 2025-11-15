# Workersmadeasy

An easy way to endpoint Cloudflare Workers with any app that needs an endpoint.

## Features

- 🚀 Simple and intuitive router for creating endpoints
- 🔌 Easy integration with any app
- 🌐 Built-in CORS support
- 📦 JSON response helpers
- 🎯 Support for GET, POST, PUT, DELETE methods
- 🔄 Dynamic route parameters
- ⚡ Serverless and fast with Cloudflare Workers

## Quick Start

### Prerequisites

- Node.js installed
- Cloudflare account (for deployment)
- Wrangler CLI (`npm install -g wrangler`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Scofowiz/Workersmadeasy.git
cd Workersmadeasy
```

2. Install dependencies:
```bash
npm install
```

3. Start local development server:
```bash
npm run dev
```

4. Deploy to Cloudflare:
```bash
npm run deploy
```

## Usage

### Basic Example

The main worker script (`src/index.js`) comes with example endpoints:

```javascript
// GET endpoint
router.get('/api/hello', (request) => {
  return jsonResponse({
    message: 'Hello from Cloudflare Workers!',
    timestamp: new Date().toISOString()
  });
});

// POST endpoint
router.post('/api/echo', async (request) => {
  const body = await parseJsonBody(request);
  return jsonResponse({
    received: body,
    timestamp: new Date().toISOString()
  });
});
```

### Creating Custom Endpoints

1. Import the Router and helpers:
```javascript
import { Router, jsonResponse, parseJsonBody } from './src/index.js';
```

2. Create a router instance:
```javascript
const router = new Router();
```

3. Add your endpoints:
```javascript
router.get('/api/users', async (request) => {
  return jsonResponse({ users: [] });
});

router.post('/api/users', async (request) => {
  const body = await parseJsonBody(request);
  return jsonResponse({ created: body }, 201);
});
```

### Dynamic Routes

Support for URL parameters:

```javascript
router.get('/api/users/:id', async (request) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  return jsonResponse({ userId: id });
});
```

### Query Parameters

Access query parameters from the URL:

```javascript
router.get('/api/search', (request) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  return jsonResponse({ searchQuery: query });
});
```

## API Reference

### Router Class

- `router.get(path, handler)` - Register a GET endpoint
- `router.post(path, handler)` - Register a POST endpoint
- `router.put(path, handler)` - Register a PUT endpoint
- `router.delete(path, handler)` - Register a DELETE endpoint
- `router.handle(request)` - Handle incoming requests

### Helper Functions

- `jsonResponse(data, status)` - Create JSON response with CORS headers
- `parseJsonBody(request)` - Parse JSON body from request

## Examples

Check the `/examples` folder for more use cases:

- `custom-endpoints.js` - Creating custom API endpoints
- `external-api.js` - Integrating with external APIs
- `kv-storage.js` - Using Cloudflare KV storage

## Configuration

Edit `wrangler.toml` to configure your worker:

```toml
name = "workersmadeasy"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.production]
name = "workersmadeasy-prod"
```

## Deployment

Deploy to Cloudflare Workers:

```bash
# Login to Cloudflare
wrangler login

# Deploy to production
npm run deploy

# Deploy to staging
wrangler deploy --env staging
```

## Integration with Your App

### Frontend Integration

```javascript
// Fetch from your worker endpoint
fetch('https://your-worker.workers.dev/api/hello')
  .then(response => response.json())
  .then(data => console.log(data));

// POST data to your worker
fetch('https://your-worker.workers.dev/api/echo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### Mobile App Integration

Use the same HTTP endpoints from any mobile app framework (React Native, Flutter, Swift, Kotlin, etc.).

### Backend Integration

Call your worker endpoints from any backend service using standard HTTP clients.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

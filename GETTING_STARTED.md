# Getting Started with Workersmadeasy

This guide will help you quickly get started with creating your own Cloudflare Workers endpoints.

## Step 1: Prerequisites

Before you begin, make sure you have:

- Node.js (v16 or later) installed
- A Cloudflare account (free tier works great)
- Basic knowledge of JavaScript

## Step 2: Install Dependencies

```bash
npm install
```

This will install Wrangler, the official Cloudflare Workers CLI tool.

## Step 3: Test Locally

Start a local development server:

```bash
npm run dev
```

This will start a local server (usually at `http://localhost:8787`) where you can test your endpoints.

## Step 4: Try the Example Endpoints

Once the dev server is running, you can test the built-in endpoints:

### Get API Info
```bash
curl http://localhost:8787/
```

### Hello Endpoint
```bash
curl http://localhost:8787/api/hello
```

### Echo Endpoint (POST)
```bash
curl -X POST http://localhost:8787/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello World"}'
```

### Time Endpoint with Query Parameters
```bash
curl http://localhost:8787/api/time?timezone=America/New_York
```

## Step 5: Create Your Own Endpoints

Edit `src/index.js` and add your own endpoints:

```javascript
// Add a new GET endpoint
router.get('/api/myendpoint', (request) => {
  return jsonResponse({
    message: 'This is my custom endpoint!',
    timestamp: new Date().toISOString()
  });
});

// Add a new POST endpoint
router.post('/api/mydata', async (request) => {
  const body = await parseJsonBody(request);
  
  // Process the data
  const result = {
    received: body,
    processed: true
  };
  
  return jsonResponse(result, 201);
});
```

## Step 6: Deploy to Cloudflare

1. Login to Cloudflare:
```bash
npx wrangler login
```

2. Deploy your worker:
```bash
npm run deploy
```

3. Your worker will be available at: `https://workersmadeasy.YOUR_SUBDOMAIN.workers.dev`

## Next Steps

- Check out the [examples](../examples/) folder for more advanced use cases
- Read the [API documentation](API.md) for detailed information
- Explore Cloudflare Workers features like KV storage, Durable Objects, and more

## Common Issues

### Port Already in Use
If you get a "port already in use" error, you can specify a different port:
```bash
npx wrangler dev --port 8788
```

### Authentication Issues
Make sure you're logged in to Cloudflare:
```bash
npx wrangler whoami
```

### Module Not Found
Make sure you've run `npm install` before trying to run the dev server.

## Getting Help

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Issues](https://github.com/Scofowiz/Workersmadeasy/issues)

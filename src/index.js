/**
 * Workersmadeasy - Easy Cloudflare Workers Endpoint Framework
 * 
 * This provides a simple way to create endpoints for Cloudflare Workers
 * that can be used with any app.
 */

// Router class to manage endpoints
class Router {
  constructor() {
    this.routes = {};
  }

  // Register a GET endpoint
  get(path, handler) {
    this.addRoute('GET', path, handler);
  }

  // Register a POST endpoint
  post(path, handler) {
    this.addRoute('POST', path, handler);
  }

  // Register a PUT endpoint
  put(path, handler) {
    this.addRoute('PUT', path, handler);
  }

  // Register a DELETE endpoint
  delete(path, handler) {
    this.addRoute('DELETE', path, handler);
  }

  // Register any HTTP method
  addRoute(method, path, handler) {
    const key = `${method}:${path}`;
    this.routes[key] = handler;
  }

  // Handle incoming requests
  async handle(request) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;
    
    // Try exact match first
    const key = `${method}:${path}`;
    if (this.routes[key]) {
      try {
        return await this.routes[key](request);
      } catch (error) {
        return this.errorResponse(error);
      }
    }

    // Try pattern matching for dynamic routes
    for (const [routeKey, handler] of Object.entries(this.routes)) {
      const [routeMethod, routePath] = routeKey.split(':');
      if (routeMethod === method && this.matchPath(routePath, path)) {
        try {
          return await handler(request);
        } catch (error) {
          return this.errorResponse(error);
        }
      }
    }

    // No route found
    return new Response('Not Found', { status: 404 });
  }

  // Simple path matching (supports :param syntax)
  matchPath(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    
    if (patternParts.length !== pathParts.length) {
      return false;
    }
    
    return patternParts.every((part, i) => {
      return part.startsWith(':') || part === pathParts[i];
    });
  }

  // Error response helper
  errorResponse(error) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal Server Error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to create JSON responses
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// Helper function to parse JSON body
async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Create router instance
const router = new Router();

// Example endpoints - users can modify these or add their own

// Root endpoint
router.get('/', (request) => {
  return jsonResponse({
    message: 'Workersmadeasy - Easy Cloudflare Workers Endpoint',
    version: '1.0.0',
    endpoints: [
      'GET /',
      'GET /api/hello',
      'POST /api/echo',
      'GET /api/time',
    ]
  });
});

// Simple GET endpoint
router.get('/api/hello', (request) => {
  return jsonResponse({
    message: 'Hello from Cloudflare Workers!',
    timestamp: new Date().toISOString()
  });
});

// POST endpoint that echoes back the body
router.post('/api/echo', async (request) => {
  const body = await parseJsonBody(request);
  return jsonResponse({
    received: body,
    timestamp: new Date().toISOString()
  });
});

// GET endpoint with query parameters
router.get('/api/time', (request) => {
  const url = new URL(request.url);
  const timezone = url.searchParams.get('timezone') || 'UTC';
  
  return jsonResponse({
    currentTime: new Date().toISOString(),
    timezone: timezone,
    timestamp: Date.now()
  });
});

// Main fetch handler
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Route the request
    return router.handle(request);
  }
};

// Export utilities for use in other files
export { Router, jsonResponse, parseJsonBody };

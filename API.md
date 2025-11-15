# API Documentation

## Router Class

The Router class is the core of Workersmadeasy. It manages all your endpoints and handles incoming requests.

### Constructor

```javascript
const router = new Router();
```

### Methods

#### `router.get(path, handler)`

Register a GET endpoint.

**Parameters:**
- `path` (string): The URL path for the endpoint (e.g., '/api/users')
- `handler` (function): Async function that handles the request

**Example:**
```javascript
router.get('/api/users', async (request) => {
  return jsonResponse({ users: [] });
});
```

#### `router.post(path, handler)`

Register a POST endpoint.

**Parameters:**
- `path` (string): The URL path for the endpoint
- `handler` (function): Async function that handles the request

**Example:**
```javascript
router.post('/api/users', async (request) => {
  const body = await parseJsonBody(request);
  return jsonResponse({ created: body }, 201);
});
```

#### `router.put(path, handler)`

Register a PUT endpoint.

**Parameters:**
- `path` (string): The URL path for the endpoint
- `handler` (function): Async function that handles the request

**Example:**
```javascript
router.put('/api/users/:id', async (request) => {
  const body = await parseJsonBody(request);
  return jsonResponse({ updated: body });
});
```

#### `router.delete(path, handler)`

Register a DELETE endpoint.

**Parameters:**
- `path` (string): The URL path for the endpoint
- `handler` (function): Async function that handles the request

**Example:**
```javascript
router.delete('/api/users/:id', async (request) => {
  return jsonResponse({ deleted: true });
});
```

#### `router.handle(request)`

Handle an incoming request. This is called automatically by the worker.

**Parameters:**
- `request` (Request): The incoming HTTP request

**Returns:** Response object

## Helper Functions

### `jsonResponse(data, status)`

Create a JSON response with proper headers and CORS support.

**Parameters:**
- `data` (object): The data to return as JSON
- `status` (number, optional): HTTP status code (default: 200)

**Returns:** Response object with JSON body

**Example:**
```javascript
return jsonResponse({ message: 'Success' }, 200);
return jsonResponse({ error: 'Not found' }, 404);
```

### `parseJsonBody(request)`

Parse JSON from request body.

**Parameters:**
- `request` (Request): The incoming HTTP request

**Returns:** Promise that resolves to parsed JSON or null if parsing fails

**Example:**
```javascript
const body = await parseJsonBody(request);
if (!body) {
  return jsonResponse({ error: 'Invalid JSON' }, 400);
}
```

## Request Handler Signature

All route handlers receive a Request object and can optionally receive env and ctx parameters:

```javascript
router.get('/api/example', async (request, env, ctx) => {
  // request: Request object with method, url, headers, body
  // env: Environment bindings (KV, secrets, etc.)
  // ctx: Context object with waitUntil, passThroughOnException
  
  return jsonResponse({ data: 'example' });
});
```

## Request Object

The Request object contains:

- `request.method`: HTTP method (GET, POST, etc.)
- `request.url`: Full URL of the request
- `request.headers`: Headers object
- `request.body`: ReadableStream of the body
- `request.json()`: Parse body as JSON
- `request.text()`: Parse body as text

**Example:**
```javascript
router.post('/api/data', async (request) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('param');
  const body = await request.json();
  
  return jsonResponse({ query, body });
});
```

## Dynamic Routes

Routes can include dynamic parameters using the `:param` syntax:

```javascript
router.get('/api/users/:id', async (request) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  
  return jsonResponse({ userId: id });
});

router.get('/api/posts/:id/comments/:commentId', async (request) => {
  const parts = new URL(request.url).pathname.split('/');
  const postId = parts[3];
  const commentId = parts[5];
  
  return jsonResponse({ postId, commentId });
});
```

## Query Parameters

Access query parameters using the URL API:

```javascript
router.get('/api/search', (request) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';
  
  return jsonResponse({ query, page, limit });
});
```

## Headers

Access request headers:

```javascript
router.get('/api/auth', (request) => {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  
  return jsonResponse({ authenticated: true });
});
```

Set response headers:

```javascript
router.get('/api/data', (request) => {
  const response = jsonResponse({ data: 'example' });
  response.headers.set('X-Custom-Header', 'value');
  return response;
});
```

## CORS

CORS is automatically handled by the framework. All responses include:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

OPTIONS preflight requests are automatically handled.

## Error Handling

Errors thrown in handlers are automatically caught and returned as 500 responses:

```javascript
router.get('/api/error', async (request) => {
  throw new Error('Something went wrong');
  // Returns: { "error": "Something went wrong" } with status 500
});
```

For custom error responses:

```javascript
router.get('/api/users/:id', async (request) => {
  const id = new URL(request.url).pathname.split('/').pop();
  
  if (!id) {
    return jsonResponse({ error: 'ID is required' }, 400);
  }
  
  // Your logic here
  return jsonResponse({ user: { id } });
});
```

## Status Codes

Common HTTP status codes:

- `200`: OK - Successful GET, PUT, DELETE
- `201`: Created - Successful POST that created a resource
- `204`: No Content - Successful request with no body
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Authenticated but not authorized
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server error

**Example:**
```javascript
router.post('/api/users', async (request) => {
  const body = await parseJsonBody(request);
  
  if (!body || !body.name) {
    return jsonResponse({ error: 'Name is required' }, 400);
  }
  
  // Create user
  return jsonResponse({ user: body }, 201);
});
```

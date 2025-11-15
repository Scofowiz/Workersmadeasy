# Examples

This directory contains example workers demonstrating various use cases.

## API Worker

A simple REST API with multiple routes.

```bash
workerease init my-api --template api
cd my-api
workerease dev
```

Visit:
- `http://localhost:8787/` - Main endpoint
- `http://localhost:8787/api/status` - Status check

## Static Site Worker

Serve a static HTML website.

```bash
workerease init my-site --template static
cd my-site
workerease dev
```

Visit `http://localhost:8787/` to see your site.

## Scheduled Worker

Run tasks on a schedule (cron jobs).

```bash
workerease init my-cron --template scheduled
cd my-cron
workerease dev
```

## Custom Worker Example

Create a custom worker from scratch:

```javascript
// src/index.js
exports.fetch = async (request) => {
  const url = new URL(request.url);
  
  // Parse JSON body
  let body = {};
  if (request.method === 'POST') {
    body = await request.json();
  }
  
  // Your logic here
  const response = {
    message: 'Custom worker response',
    method: request.method,
    path: url.pathname,
    body: body
  };
  
  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response)
  };
};
```

## Authentication Example

```javascript
// src/index.js
exports.fetch = async (request) => {
  const authHeader = request.headers['authorization'];
  
  if (!authHeader || authHeader !== 'Bearer secret-token') {
    return {
      status: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  return {
    status: 200,
    body: JSON.stringify({ message: 'Authenticated!' })
  };
};
```

## Database Example

```javascript
// src/index.js
// Mock database
const db = {
  users: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
};

exports.fetch = async (request) => {
  const url = new URL(request.url);
  
  if (url.pathname === '/users') {
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db.users)
    };
  }
  
  if (url.pathname.startsWith('/users/')) {
    const id = parseInt(url.pathname.split('/')[2]);
    const user = db.users.find(u => u.id === id);
    
    if (!user) {
      return {
        status: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }
    
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    };
  }
  
  return {
    status: 404,
    body: JSON.stringify({ error: 'Not found' })
  };
};
```

## CORS Example

```javascript
// src/index.js
exports.fetch = async (request) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: headers
    };
  }
  
  return {
    status: 200,
    headers: headers,
    body: JSON.stringify({ message: 'CORS enabled!' })
  };
};
```

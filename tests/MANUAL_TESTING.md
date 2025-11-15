# Manual Testing Guide

This guide provides curl commands to test all endpoints in the Workersmadeasy framework.

## Prerequisites

Make sure your worker is running:
```bash
npm run dev
```

Or test against your deployed worker:
```bash
# Replace with your actual worker URL
export WORKER_URL="https://workersmadeasy.YOUR_SUBDOMAIN.workers.dev"
```

For local testing:
```bash
export WORKER_URL="http://localhost:8787"
```

## Testing Basic Endpoints

### 1. Root Endpoint (API Info)

```bash
curl $WORKER_URL/
```

Expected Response:
```json
{
  "message": "Workersmadeasy - Easy Cloudflare Workers Endpoint",
  "version": "1.0.0",
  "endpoints": [
    "GET /",
    "GET /api/hello",
    "POST /api/echo",
    "GET /api/time"
  ]
}
```

### 2. Hello Endpoint

```bash
curl $WORKER_URL/api/hello
```

Expected Response:
```json
{
  "message": "Hello from Cloudflare Workers!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Echo Endpoint (POST)

```bash
curl -X POST $WORKER_URL/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello World","data":[1,2,3]}'
```

Expected Response:
```json
{
  "received": {
    "message": "Hello World",
    "data": [1, 2, 3]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 4. Time Endpoint with Query Parameters

Without parameters:
```bash
curl $WORKER_URL/api/time
```

With timezone parameter:
```bash
curl "$WORKER_URL/api/time?timezone=America/New_York"
```

Expected Response:
```json
{
  "currentTime": "2024-01-01T00:00:00.000Z",
  "timezone": "UTC",
  "timestamp": 1704067200000
}
```

## Testing CORS

### Preflight Request
```bash
curl -X OPTIONS $WORKER_URL/api/hello \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Should return:
- Status: 200
- Header: `Access-Control-Allow-Origin: *`
- Header: `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`

### Cross-Origin GET Request
```bash
curl $WORKER_URL/api/hello \
  -H "Origin: https://example.com" \
  -v
```

Should return:
- Status: 200
- Header: `Access-Control-Allow-Origin: *`

## Testing Error Handling

### Non-existent Endpoint
```bash
curl $WORKER_URL/api/nonexistent
```

Expected Response:
- Status: 404
- Body: "Not Found"

### Invalid JSON (POST)
```bash
curl -X POST $WORKER_URL/api/echo \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```

Expected Response:
```json
{
  "received": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing with Different HTTP Methods

### GET Request
```bash
curl -X GET $WORKER_URL/api/hello
```

### POST Request
```bash
curl -X POST $WORKER_URL/api/echo \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

### PUT Request (if you add PUT endpoints)
```bash
curl -X PUT $WORKER_URL/api/update \
  -H "Content-Type: application/json" \
  -d '{"id":123,"value":"updated"}'
```

### DELETE Request (if you add DELETE endpoints)
```bash
curl -X DELETE $WORKER_URL/api/delete/123
```

## Testing with Headers

### Custom Headers
```bash
curl $WORKER_URL/api/hello \
  -H "X-Custom-Header: value" \
  -H "Authorization: Bearer token123"
```

### Viewing Response Headers
```bash
curl -I $WORKER_URL/api/hello
```

## Performance Testing

### Simple Load Test (using Apache Bench)
```bash
ab -n 100 -c 10 $WORKER_URL/api/hello
```

### Using curl to measure response time
```bash
curl -w "\nTime Total: %{time_total}s\n" $WORKER_URL/api/hello
```

## Automated Testing Script

Save this as `test.sh` and run with `bash test.sh`:

```bash
#!/bin/bash

WORKER_URL="${WORKER_URL:-http://localhost:8787}"

echo "Testing Workersmadeasy endpoints..."
echo "Worker URL: $WORKER_URL"
echo ""

# Test 1: Root endpoint
echo "Test 1: GET /"
curl -s $WORKER_URL/ | python -m json.tool
echo ""

# Test 2: Hello endpoint
echo "Test 2: GET /api/hello"
curl -s $WORKER_URL/api/hello | python -m json.tool
echo ""

# Test 3: Echo endpoint
echo "Test 3: POST /api/echo"
curl -s -X POST $WORKER_URL/api/echo \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}' | python -m json.tool
echo ""

# Test 4: Time endpoint
echo "Test 4: GET /api/time"
curl -s "$WORKER_URL/api/time?timezone=UTC" | python -m json.tool
echo ""

echo "All tests completed!"
```

## Testing from JavaScript

```javascript
// Browser or Node.js with fetch
const WORKER_URL = 'http://localhost:8787';

// Test GET
fetch(`${WORKER_URL}/api/hello`)
  .then(r => r.json())
  .then(data => console.log('GET result:', data));

// Test POST
fetch(`${WORKER_URL}/api/echo`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' })
})
  .then(r => r.json())
  .then(data => console.log('POST result:', data));
```

## Testing from Python

```python
import requests

WORKER_URL = 'http://localhost:8787'

# Test GET
response = requests.get(f'{WORKER_URL}/api/hello')
print('GET result:', response.json())

# Test POST
response = requests.post(
    f'{WORKER_URL}/api/echo',
    json={'message': 'Hello'}
)
print('POST result:', response.json())
```

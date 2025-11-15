/**
 * Example: Using Cloudflare KV Storage
 * 
 * This example shows how to use KV storage with your endpoints
 * Note: You need to configure KV namespace in wrangler.toml
 */

import { Router, jsonResponse, parseJsonBody } from '../src/index.js';

const router = new Router();

// Store data in KV
router.post('/api/data', async (request, env) => {
  const body = await parseJsonBody(request);
  
  if (!body || !body.key || !body.value) {
    return jsonResponse({ error: 'Key and value are required' }, 400);
  }

  try {
    // Store in KV (requires KV namespace binding)
    // await env.MY_KV.put(body.key, body.value);
    
    return jsonResponse({
      message: 'Data stored successfully',
      key: body.key
    });
  } catch (error) {
    return jsonResponse({ error: 'Failed to store data' }, 500);
  }
});

// Retrieve data from KV
router.get('/api/data/:key', async (request, env) => {
  const url = new URL(request.url);
  const key = url.pathname.split('/').pop();
  
  try {
    // Retrieve from KV (requires KV namespace binding)
    // const value = await env.MY_KV.get(key);
    
    // if (!value) {
    //   return jsonResponse({ error: 'Key not found' }, 404);
    // }

    return jsonResponse({
      key: key,
      value: 'mock-value', // Replace with actual KV value
      note: 'Configure KV namespace in wrangler.toml to use real storage'
    });
  } catch (error) {
    return jsonResponse({ error: 'Failed to retrieve data' }, 500);
  }
});

export default {
  async fetch(request, env, ctx) {
    return router.handle(request);
  }
};

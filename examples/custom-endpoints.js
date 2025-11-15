/**
 * Example: Custom Endpoints
 * 
 * This example shows how to create custom endpoints for your app
 */

import { Router, jsonResponse, parseJsonBody } from '../src/index.js';

const router = new Router();

// Custom API for a todo app
router.get('/api/todos', async (request) => {
  // In a real app, you'd fetch from a database (KV, D1, etc.)
  return jsonResponse({
    todos: [
      { id: 1, title: 'Learn Cloudflare Workers', completed: false },
      { id: 2, title: 'Build an API', completed: true },
    ]
  });
});

router.post('/api/todos', async (request) => {
  const body = await parseJsonBody(request);
  
  // Validate input
  if (!body || !body.title) {
    return jsonResponse({ error: 'Title is required' }, 400);
  }

  // In a real app, you'd save to a database
  const newTodo = {
    id: Date.now(),
    title: body.title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  return jsonResponse({ todo: newTodo }, 201);
});

// Dynamic route example
router.get('/api/todos/:id', async (request) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  
  // In a real app, you'd fetch from a database
  return jsonResponse({
    todo: { id, title: 'Example Todo', completed: false }
  });
});

export default {
  async fetch(request, env, ctx) {
    return router.handle(request);
  }
};

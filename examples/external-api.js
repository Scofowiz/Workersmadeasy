/**
 * Example: Integration with External API
 * 
 * This example shows how to proxy requests to external APIs
 */

import { Router, jsonResponse } from '../src/index.js';

const router = new Router();

// Proxy to external API
router.get('/api/weather', async (request) => {
  const url = new URL(request.url);
  const city = url.searchParams.get('city') || 'London';
  
  try {
    // Example: fetching from a weather API (you'd need an API key)
    // const response = await fetch(`https://api.weather.com/data?city=${city}`);
    // const data = await response.json();
    
    // Mock response for demonstration
    return jsonResponse({
      city: city,
      temperature: 20,
      condition: 'Sunny',
      note: 'This is a mock response. Integrate with real weather API.'
    });
  } catch (error) {
    return jsonResponse({ error: 'Failed to fetch weather data' }, 500);
  }
});

// Endpoint that combines multiple external API calls
router.get('/api/combined', async (request) => {
  try {
    // Fetch from multiple sources in parallel
    const [data1, data2] = await Promise.all([
      fetch('https://api.example.com/data1').then(r => r.json()).catch(() => null),
      fetch('https://api.example.com/data2').then(r => r.json()).catch(() => null),
    ]);

    return jsonResponse({
      combined: { data1, data2 },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});

export default {
  async fetch(request, env, ctx) {
    return router.handle(request);
  }
};

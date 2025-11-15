interface Template {
  name: string;
  description: string;
  files: Record<string, string>;
}

const apiTemplate: Template = {
  name: 'api',
  description: 'Simple API Worker',
  files: {
    'src/index.js': `// Simple API Worker
// Handle incoming requests

exports.fetch = async (request) => {
  const url = new URL(request.url);
  
  // Route handling
  if (url.pathname === '/') {
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Hello from Workers Made Easy!',
        path: url.pathname 
      })
    };
  }
  
  if (url.pathname === '/api/status') {
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'ok',
        timestamp: Date.now()
      })
    };
  }
  
  // 404 for unknown routes
  return {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Not found' })
  };
};
`,
    'workerease.json': `{
  "name": "my-worker",
  "version": "1.0.0",
  "type": "api",
  "main": "src/index.js"
}
`,
    'README.md': `# My Worker

Created with Workers Made Easy!

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
workerease dev

# Test your worker
workerease run

# Deploy
workerease deploy
\`\`\`

## Routes

- \`/\` - Main endpoint
- \`/api/status\` - Status check

## Learn More

Edit \`src/index.js\` to add your own logic!
`,
    'package.json': `{
  "name": "my-worker",
  "version": "1.0.0",
  "description": "Worker created with Workers Made Easy",
  "main": "src/index.js",
  "scripts": {
    "dev": "workerease dev",
    "deploy": "workerease deploy"
  },
  "keywords": ["worker"],
  "license": "MIT"
}
`
  }
};

const staticTemplate: Template = {
  name: 'static',
  description: 'Static Site Worker',
  files: {
    'src/index.js': `// Static Site Worker
// Serve static content

exports.fetch = async (request) => {
  const url = new URL(request.url);
  
  const html = \`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Workers Made Easy</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 600px;
      margin: 100px auto;
      padding: 20px;
      text-align: center;
    }
    h1 { color: #0070f3; }
  </style>
</head>
<body>
  <h1>🚀 Workers Made Easy</h1>
  <p>Your static worker is running!</p>
  <p>Edit <code>src/index.js</code> to customize this page.</p>
</body>
</html>
  \`;
  
  return {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
    body: html
  };
};
`,
    'workerease.json': `{
  "name": "my-static-worker",
  "version": "1.0.0",
  "type": "static",
  "main": "src/index.js"
}
`,
    'README.md': `# Static Worker

Created with Workers Made Easy!

## Getting Started

\`\`\`bash
workerease dev
\`\`\`

Visit http://localhost:8787 to see your site!
`,
    'package.json': `{
  "name": "my-static-worker",
  "version": "1.0.0",
  "description": "Static worker created with Workers Made Easy",
  "main": "src/index.js",
  "scripts": {
    "dev": "workerease dev",
    "deploy": "workerease deploy"
  },
  "keywords": ["worker", "static"],
  "license": "MIT"
}
`
  }
};

const scheduledTemplate: Template = {
  name: 'scheduled',
  description: 'Scheduled Worker (Cron)',
  files: {
    'src/index.js': `// Scheduled Worker
// Runs on a schedule (cron job)

exports.fetch = async (request) => {
  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: 'Scheduled worker is configured',
      info: 'This worker runs on a schedule'
    })
  };
};

exports.scheduled = async (event) => {
  // This runs on schedule
  console.log('Scheduled task executed at:', new Date().toISOString());
  
  // Add your scheduled logic here
  // For example: cleanup, data sync, notifications, etc.
  
  return { success: true };
};
`,
    'workerease.json': `{
  "name": "my-scheduled-worker",
  "version": "1.0.0",
  "type": "scheduled",
  "main": "src/index.js",
  "schedule": "*/5 * * * *"
}
`,
    'README.md': `# Scheduled Worker

Created with Workers Made Easy!

## Schedule

This worker runs every 5 minutes (configurable in workerease.json)

## Getting Started

\`\`\`bash
workerease dev
\`\`\`
`,
    'package.json': `{
  "name": "my-scheduled-worker",
  "version": "1.0.0",
  "description": "Scheduled worker created with Workers Made Easy",
  "main": "src/index.js",
  "scripts": {
    "dev": "workerease dev",
    "deploy": "workerease deploy"
  },
  "keywords": ["worker", "scheduled", "cron"],
  "license": "MIT"
}
`
  }
};

export function getTemplate(type: string): Template {
  switch (type) {
    case 'static':
      return staticTemplate;
    case 'scheduled':
      return scheduledTemplate;
    case 'api':
    default:
      return apiTemplate;
  }
}

export function listTemplates(): Template[] {
  return [apiTemplate, staticTemplate, scheduledTemplate];
}

# Workers Made Easy 🚀

> Make workers as easy as running llama!

A simple CLI tool that makes working with workers (Cloudflare Workers, etc.) as easy as running a local application. No complex configuration, no steep learning curve - just pure simplicity.

## Why Workers Made Easy?

Working with workers shouldn't be complicated. Just like running Llama models locally with a simple command, Workers Made Easy gives you:

- **Simple CLI** - `workerease init`, `workerease dev`, `workerease deploy` - that's it!
- **Quick Start** - Get a worker running in under 30 seconds
- **Templates** - Pre-built templates for common use cases (API, static sites, scheduled tasks)
- **Local Development** - Test workers locally before deploying
- **Zero Config** - Sensible defaults that just work

## Installation

```bash
npm install -g workersmadeasy
```

Or use with npx:

```bash
npx workersmadeasy init my-worker
```

## Quick Start

```bash
# Create a new worker
workerease init my-awesome-worker

# Navigate to project
cd my-awesome-worker

# Install dependencies
npm install

# Start development server
workerease dev

# Visit http://localhost:8787
```

That's it! Your worker is now running locally.

## Commands

### `workerease init [name]`

Initialize a new worker project.

```bash
workerease init my-worker
workerease init my-api --template api
workerease init my-site --template static
```

**Options:**
- `-t, --template <type>` - Template type: `api`, `static`, or `scheduled` (default: `api`)

### `workerease dev`

Start a local development server.

```bash
workerease dev
workerease dev --port 3000
```

**Options:**
- `-p, --port <port>` - Port to run on (default: `8787`)

### `workerease run`

Quick test your worker locally.

```bash
workerease run
workerease run --file index.js
```

**Options:**
- `-f, --file <file>` - Worker file to run (default: `index.js`)

### `workerease deploy`

Deploy your worker.

```bash
workerease deploy
workerease deploy --env staging
```

**Options:**
- `-e, --env <environment>` - Environment to deploy to (default: `production`)

## Templates

### API Worker
Perfect for building REST APIs, webhooks, and backend services.

```bash
workerease init my-api --template api
```

### Static Site Worker
Serve static websites and single-page applications.

```bash
workerease init my-site --template static
```

### Scheduled Worker
Run tasks on a schedule (cron jobs).

```bash
workerease init my-cron --template scheduled
```

## Example Worker

```javascript
// src/index.js
exports.fetch = async (request) => {
  const url = new URL(request.url);
  
  if (url.pathname === '/') {
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Hello from Workers Made Easy!' 
      })
    };
  }
  
  return {
    status: 404,
    body: JSON.stringify({ error: 'Not found' })
  };
};
```

## Aliases

You can use the short alias `we` instead of `workerease`:

```bash
we init my-worker
we dev
we deploy
```

## Philosophy

Workers Made Easy follows the "llama principle" - if running Llama can be as simple as `llama run`, then working with workers should be just as simple. We believe in:

1. **Simplicity First** - Complex features shouldn't require complex setup
2. **Developer Experience** - Beautiful CLI, helpful messages, and intuitive commands
3. **Get Started Fast** - From zero to deployed in minutes
4. **No Lock-in** - Standard worker format that works everywhere

## Requirements

- Node.js 14 or higher
- npm or yarn

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

Made with ❤️ for developers who want simplicity

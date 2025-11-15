import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';

interface DevOptions {
  port: string;
}

export async function devCommand(options: DevOptions) {
  console.log(chalk.cyan.bold('\n🔧 Starting Development Server\n'));

  const workerFile = path.join(process.cwd(), 'src', 'index.js');
  
  if (!await fs.pathExists(workerFile)) {
    console.log(chalk.red('❌ Worker file not found. Run "workerease init" first.'));
    return;
  }

  const spinner = ora('Starting server...').start();

  try {
    spinner.succeed(chalk.green(`Development server starting on port ${options.port}`));
    
    console.log(chalk.cyan('\n📡 Server Info:\n'));
    console.log(chalk.white(`  Local:   http://localhost:${options.port}`));
    console.log(chalk.gray('\n  Press Ctrl+C to stop\n'));

    // Simple HTTP server for development
    const server = spawn('node', [
      '-e',
      `
      const http = require('http');
      const fs = require('fs');
      const path = require('path');
      
      const server = http.createServer(async (req, res) => {
        console.log('${chalk.gray('→')} ' + req.method + ' ' + req.url);
        
        try {
          // Load worker
          delete require.cache[require.resolve(process.cwd() + '/src/index.js')];
          const worker = require(process.cwd() + '/src/index.js');
          
          // Create request object
          const request = {
            url: 'http://localhost:${options.port}' + req.url,
            method: req.method,
            headers: req.headers
          };
          
          // Execute worker
          const response = await worker.fetch(request);
          
          // Send response
          res.writeHead(response.status || 200, response.headers || {});
          res.end(response.body || 'OK');
        } catch (error) {
          console.error('Error:', error.message);
          res.writeHead(500);
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      
      server.listen(${options.port}, () => {
        console.log('Server ready');
      });
      `
    ], { stdio: 'inherit' });

    server.on('error', (error) => {
      console.log(chalk.red('\n❌ Server error:'), error);
    });

  } catch (error) {
    spinner.fail(chalk.red('Failed to start server'));
    console.error(error);
  }
}

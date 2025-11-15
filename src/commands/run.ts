import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

interface RunOptions {
  file: string;
}

export async function runCommand(options: RunOptions) {
  console.log(chalk.cyan.bold('\n⚡ Quick Run Worker\n'));

  const workerFile = path.join(process.cwd(), 'src', options.file);
  
  if (!await fs.pathExists(workerFile)) {
    console.log(chalk.red(`❌ Worker file not found: ${options.file}`));
    return;
  }

  const spinner = ora('Running worker...').start();

  try {
    // Load and execute worker
    const workerPath = path.resolve(workerFile);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    delete require.cache[require.resolve(workerPath)];
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const worker = require(workerPath);

    // Create test request
    const testRequest = {
      url: 'http://localhost:8787/',
      method: 'GET',
      headers: {}
    };

    spinner.text = 'Executing worker...';
    
    // Execute worker
    const response = await worker.fetch(testRequest);
    
    spinner.succeed(chalk.green('Worker executed successfully!'));
    
    console.log(chalk.cyan('\n📋 Response:\n'));
    console.log(chalk.white(`  Status: ${response.status || 200}`));
    console.log(chalk.white(`  Body: ${response.body || 'OK'}`));
    console.log();

  } catch (error) {
    spinner.fail(chalk.red('Execution failed'));
    console.error(chalk.red('\nError:'), (error as Error).message);
  }
}

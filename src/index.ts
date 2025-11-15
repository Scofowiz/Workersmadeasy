#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { devCommand } from './commands/dev';
import { deployCommand } from './commands/deploy';
import { runCommand } from './commands/run';

// Show banner if no arguments
if (!process.argv.slice(2).length) {
  console.log(chalk.cyan.bold('\n🚀 Workers Made Easy\n'));
  console.log(chalk.white('Make workers as easy as running llama!\n'));
}

const program = new Command();

program
  .name('workerease')
  .description('Make workers as easy as running llama - A simple CLI for worker development')
  .version('1.0.0');

program
  .command('init [name]')
  .description('Initialize a new worker project')
  .option('-t, --template <type>', 'Template type (api, static, scheduled)', 'api')
  .action(initCommand);

program
  .command('dev')
  .description('Start local development server')
  .option('-p, --port <port>', 'Port to run on', '8787')
  .action(devCommand);

program
  .command('deploy')
  .description('Deploy worker to production')
  .option('-e, --env <environment>', 'Environment to deploy to', 'production')
  .action(deployCommand);

program
  .command('run')
  .description('Run worker locally (quick test)')
  .option('-f, --file <file>', 'Worker file to run', 'index.js')
  .action(runCommand);

program.parse(process.argv);

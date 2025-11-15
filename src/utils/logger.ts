import chalk from 'chalk';

export function printBanner() {
  console.log(chalk.cyan.bold(`
╦ ╦╔═╗╦═╗╦╔═╔═╗╦═╗╔═╗  ╔╦╗╔═╗╔╦╗╔═╗  ╔═╗╔═╗╔═╗╦ ╦
║║║║ ║╠╦╝╠╩╗║╣ ╠╦╝╚═╗  ║║║╠═╣ ║║║╣   ║╣ ╠═╣╚═╗╚╦╝
╚╩╝╚═╝╩╚═╩ ╩╚═╝╩╚═╚═╝  ╩ ╩╩ ╩═╩╝╚═╝  ╚═╝╩ ╩╚═╝ ╩ 
  `));
  console.log(chalk.gray('  Make workers as easy as running llama!\n'));
}

export function logSuccess(message: string) {
  console.log(chalk.green('✓'), message);
}

export function logError(message: string) {
  console.log(chalk.red('✗'), message);
}

export function logInfo(message: string) {
  console.log(chalk.blue('ℹ'), message);
}

export function logWarning(message: string) {
  console.log(chalk.yellow('⚠'), message);
}

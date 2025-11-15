import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { getTemplate } from '../templates';

interface InitOptions {
  template: string;
}

export async function initCommand(name: string | undefined, options: InitOptions) {
  console.log(chalk.cyan.bold('\n🚀 Initialize New Worker Project\n'));

  // If no name provided, ask for it
  if (!name) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-worker',
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'Project name is required';
          }
          return true;
        }
      }
    ]);
    name = answers.projectName;
  }

  const projectPath = path.join(process.cwd(), name!);

  // Check if directory exists
  if (await fs.pathExists(projectPath)) {
    console.log(chalk.red(`\n❌ Directory ${name} already exists!`));
    return;
  }

  const spinner = ora('Creating project...').start();

  try {
    // Create project directory
    await fs.ensureDir(projectPath);

    // Get template files
    const template = getTemplate(options.template);
    
    // Create files from template
    for (const [filePath, content] of Object.entries(template.files)) {
      const fullPath = path.join(projectPath, filePath);
      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, content);
    }

    spinner.succeed(chalk.green('Project created successfully!'));

    console.log(chalk.cyan('\n📦 Next steps:\n'));
    console.log(chalk.white(`  cd ${name}`));
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  workerease dev'));
    console.log(chalk.gray('\n✨ Happy coding!\n'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
  }
}

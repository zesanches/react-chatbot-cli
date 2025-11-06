import * as fs from 'fs-extra';
import * as path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';

interface Config {
  componentsPath: string;
  typescript: boolean;
}

const DEFAULT_CONFIG: Config = {
  componentsPath: 'src/components',
  typescript: true,
};

export async function init() {
  console.log(chalk.bold('\n🤖 Welcome to React Chatbot CLI\n'));

  const cwd = process.cwd();
  const configPath = path.join(cwd, 'chatbot-cli.json');

  if (await fs.pathExists(configPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'Configuration already exists. Overwrite?',
      initial: false,
    });

    if (!overwrite) {
      console.log(chalk.yellow('Initialization cancelled.'));
      return;
    }
  }

  const packageJsonPath = path.join(cwd, 'package.json');
  if (!(await fs.pathExists(packageJsonPath))) {
    console.log(chalk.red('Error: package.json not found. Are you in a project directory?'));
    process.exit(1);
  }

  const packageJson = await fs.readJson(packageJsonPath);
  const hasReact = packageJson.dependencies?.react || packageJson.devDependencies?.react;

  if (!hasReact) {
    console.log(chalk.yellow('Warning: React not found in dependencies.'));
  }

  const hasTsConfig = await fs.pathExists(path.join(cwd, 'tsconfig.json'));

  const response = await prompts([
    {
      type: 'text',
      name: 'componentsPath',
      message: 'Where would you like to add components?',
      initial: DEFAULT_CONFIG.componentsPath,
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      initial: hasTsConfig,
    },
  ]);

  if (!response.componentsPath) {
    console.log(chalk.yellow('Initialization cancelled.'));
    return;
  }

  const config: Config = {
    componentsPath: response.componentsPath,
    typescript: response.typescript,
  };

  const spinner = ora('Creating configuration...').start();

  try {
    await fs.writeJson(configPath, config, { spaces: 2 });

    const componentsDir = path.join(cwd, config.componentsPath);
    await fs.ensureDir(componentsDir);

    spinner.succeed('Configuration created successfully!');

    console.log(chalk.green('\n✓ Setup complete!'));
    console.log(chalk.dim(`\nYou can now run: ${chalk.cyan('react-chatbot-cli add openai')}`));
  } catch (error) {
    spinner.fail('Failed to create configuration');
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}

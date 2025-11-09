import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig } from '../utils/config';
import { getTemplate } from '../utils/templates';
import { listAvailableComponents } from '../utils/registry';

export async function add(component: string) {
  const spinner = ora('Checking configuration...').start();

  try {
    const availableComponents = listAvailableComponents();
    const componentNames = availableComponents.map(c => c.name);

    if (!componentNames.includes(component)) {
      spinner.fail('Invalid component');
      console.log(chalk.red(`\nComponent "${component}" not found.`));
      console.log(chalk.dim('\nAvailable components:'));
      availableComponents.forEach(c => {
        console.log(chalk.cyan(`  - ${c.name}`) + chalk.dim(` - ${c.description}`));
      });
      process.exit(1);
    }

    const config = await getConfig();
    if (!config) {
      spinner.fail('Configuration not found');
      console.log(chalk.red('\nPlease run "react-chatbot-cli init" first.'));
      process.exit(1);
    }

    spinner.text = `Fetching ${component} component from remote repository...`;

    const cwd = process.cwd();
    const componentsDir = path.join(cwd, config.componentsPath);
    const hooksDir = path.join(cwd, config.hooksPath);
    const providersDir = path.join(cwd, config.providersPath);
    const template = await getTemplate(component, config.typescript);

    spinner.text = `Installing ${component} component...`;

    for (const file of template.files) {
      let filePath;

      if (file.path.includes("Provider")) {
        filePath = path.join(providersDir, file.path);
      } else if (file.path.includes("use")) {
        filePath = path.join(hooksDir, file.path);
      } else {
        filePath = path.join(componentsDir, file.path);
      }

      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, file.content);
    }

    const packageJsonPath = path.join(cwd, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    const missingDeps = template.dependencies.filter(
      dep => !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );

    spinner.succeed(`Added ${component} component!`);

    console.log(chalk.green('\n✓ Component added successfully!\n'));
    console.log(chalk.bold('Files created:'));
    template.files.forEach(file => {
      console.log(chalk.dim(`  ${path.join(config.componentsPath, file.path)}`));
    });

    if (missingDeps.length > 0) {
      console.log(chalk.yellow('\n⚠ Missing dependencies:'));
      missingDeps.forEach(dep => console.log(chalk.dim(`  - ${dep}`)));
      console.log(chalk.dim(`\nInstall them with: ${chalk.cyan(`npm install ${missingDeps.join(' ')}`)}`));
    }

    if (template.envVars && template.envVars.length > 0) {
      console.log(chalk.yellow('\n⚠ Required environment variables:'));
      template.envVars.forEach(envVar => console.log(chalk.dim(`  - ${envVar}`)));
      console.log(chalk.dim('\nAdd these to your .env file'));
    }

    console.log(chalk.dim('\nUsage example:'));
    console.log(chalk.cyan(template.usage));
  } catch (error) {
    spinner.fail('Failed to add component');
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}

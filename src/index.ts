#!/usr/bin/env node

import { Command } from 'commander';
import { add } from './commands/add';
import { init } from './commands/init';

const program = new Command();

program
  .name('react-chatbot-cli')
  .option('--help', 'Display help information')
  .description('CLI tool to add chatbot components to React projects')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize configuration for react-chatbot-cli')
  .action(init);

program
  .command('add')
  .argument('<component>', 'Name of the component to add')
  .description('Add a chatbot component to your project')
  .action(add);

program.parse();

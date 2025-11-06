import * as fs from 'fs-extra';
import * as path from 'path';

export interface Config {
  componentsPath: string;
  typescript: boolean;
}

export async function getConfig(): Promise<Config | null> {
  const cwd = process.cwd();
  const configPath = path.join(cwd, 'chatbot-cli.json');

  if (!(await fs.pathExists(configPath))) {
    return null;
  }

  return fs.readJson(configPath);
}

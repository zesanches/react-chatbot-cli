import { getComponentFromRegistry } from './registry';
import { fetchFromGitHub, convertTsToJs, convertFileExtension, RemoteFile } from './fetcher';

export interface TemplateFile {
  path: string;
  content: string;
}

export interface Template {
  files: TemplateFile[];
  dependencies: string[];
  envVars?: string[];
  usage: string;
}

/**
 * Fetches a component template from external repository
 * @param component - Component name (e.g., 'openai')
 * @param typescript - Whether to use TypeScript
 * @param githubOwner - GitHub username/organization (defaults to env var or 'your-org')
 */
export async function getTemplate(
  component: string,
  typescript: boolean,
  githubOwner?: string
): Promise<Template> {
  const componentInfo = getComponentFromRegistry(component);

  if (!componentInfo) {
    throw new Error(`Component "${component}" not found in registry`);
  }

  const owner = githubOwner || process.env.GITHUB_OWNER || 'your-github-username';

  try {
    const remoteFiles = await fetchFromGitHub(
      owner,
      componentInfo.repo,
      componentInfo.branch,
      componentInfo.path
    );

    const files: TemplateFile[] = remoteFiles.map((file) => {
      let content = file.content;
      let filePath = file.path;

      if (!typescript && (filePath.endsWith('.tsx') || filePath.endsWith('.ts'))) {
        content = convertTsToJs(content);
        filePath = convertFileExtension(filePath, false);
      }

      return {
        path: `Chatbot/${filePath}`,
        content,
      };
    });

    const usage = generateUsageExample(component, typescript);

    return {
      files,
      dependencies: componentInfo.dependencies,
      envVars: componentInfo.envVars,
      usage,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch component from ${owner}/${componentInfo.repo}: ${error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

function generateUsageExample(component: string, typescript: boolean): string {
  const ext = typescript ? 'tsx' : 'jsx';

  switch (component) {
    case 'openai':
      return `import { Chatbot } from './components/Chatbot/Chatbot';

function App() {
  return (
    <Chatbot
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      systemPrompt="You are a helpful assistant."
      model="gpt-3.5-turbo"
    />
  );
}`;
    default:
      return `import { Chatbot } from './components/Chatbot/Chatbot';

function App() {
  return <Chatbot />;
}`;
  }
}

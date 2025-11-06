export interface ComponentRegistry {
  name: string;
  repo: string;
  branch: string;
  path: string;
  dependencies: string[];
  envVars?: string[];
  description: string;
}

export const REGISTRY: Record<string, ComponentRegistry> = {
  openai: {
    name: 'openai',
    repo: 'react-chatbot-openai',
    branch: 'main',
    path: 'src/components/Chatbot',
    dependencies: ['react'],
    envVars: ['REACT_APP_OPENAI_API_KEY'],
    description: 'Chatbot component with OpenAI integration',
  },
};

export function getComponentFromRegistry(name: string): ComponentRegistry | null {
  return REGISTRY[name] || null;
}

export function listAvailableComponents(): ComponentRegistry[] {
  return Object.values(REGISTRY);
}

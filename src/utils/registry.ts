export interface ComponentRegistry {
  name: string;
  repo: string;
  branch: string;
  path: string;
  hookPath: string;
  providerPath: string;
  dependencies: string[];
  envVars?: string[];
  description: string;
}

export const REGISTRY: Record<string, ComponentRegistry> = {
  openai: {
    name: 'openai',
    repo: 'react-chatbot-openai',
    branch: 'main',
    path: 'src/components/Chatbot/index.tsx',
    hookPath: 'src/hooks/useChatbot.tsx',
    providerPath: 'src/provider/openaiProvider.tsx',
    dependencies: ['react', "openai", "react-markdown"],
    envVars: ['VITE_OPENAI_API_KEY', 'REACT_APP_OPENAI_API_KEY'],
    description: 'Chatbot component with OpenAI integration',
  },
};

export function getComponentFromRegistry(name: string): ComponentRegistry | null {
  return REGISTRY[name] || null;
}

export function listAvailableComponents(): ComponentRegistry[] {
  return Object.values(REGISTRY);
}

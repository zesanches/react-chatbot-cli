# Component Repository Template

This is a template for creating new chatbot component repositories that work with `react-chatbot-cli`.

## Repository Structure

Your repository should follow this structure:

```
react-chatbot-[provider]/
├── src/
│   └── components/
│       └── Chatbot/
│           ├── Chatbot.tsx (or .jsx)
│           ├── Chatbot.css (optional)
│           └── index.ts (optional)
├── package.json
├── README.md
└── .gitignore
```

## Example: react-chatbot-openai

### Directory Structure

```
react-chatbot-openai/
├── src/
│   └── components/
│       └── Chatbot/
│           ├── Chatbot.tsx
│           └── Chatbot.css
├── package.json
└── README.md
```

### Component Requirements

1. **TypeScript Support**: Components should be written in TypeScript
   - The CLI will automatically convert to JavaScript if needed
   - Use proper types for props and state

2. **Self-Contained**: Component should work standalone
   - Include all necessary styles
   - Minimal external dependencies
   - Clear prop interfaces

3. **Environment Variables**: Document required env vars
   - Use `REACT_APP_` prefix for Create React App compatibility
   - Provide clear examples

### Example Component (Chatbot.tsx)

```typescript
import React, { useState } from 'react';
import './Chatbot.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  apiKey: string;
  systemPrompt?: string;
  model?: string;
}

export function Chatbot({
  apiKey,
  systemPrompt = 'You are a helpful assistant.',
  model = 'gpt-3.5-turbo'
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // Implementation...

  return (
    <div className="chatbot-container">
      {/* Component JSX */}
    </div>
  );
}
```

### package.json

```json
{
  "name": "react-chatbot-openai",
  "version": "1.0.0",
  "description": "OpenAI chatbot component for react-chatbot-cli",
  "main": "src/components/Chatbot/Chatbot.tsx",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/react-chatbot-openai"
  },
  "keywords": [
    "react",
    "chatbot",
    "openai",
    "component"
  ],
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "license": "MIT"
}
```

### README.md

Document:
- Component props and their types
- Required environment variables
- Usage examples
- Any special setup instructions

## Registering Your Component

After creating your repository, add it to the CLI registry:

1. Fork `react-chatbot-cli`
2. Edit `src/utils/registry.ts`:

```typescript
export const REGISTRY: Record<string, ComponentRegistry> = {
  // ... existing components

  yourprovider: {
    name: 'yourprovider',
    repo: 'react-chatbot-yourprovider',
    branch: 'main',
    path: 'src/components/Chatbot',
    dependencies: ['react', 'other-deps'],
    envVars: ['REACT_APP_YOUR_API_KEY'],
    description: 'Chatbot component with YourProvider integration',
  },
};
```

3. Submit a pull request

## Testing Your Component

Before submitting:

1. Create a test React project
2. Run the CLI pointing to your repository:
   ```bash
   export GITHUB_OWNER=your-username
   react-chatbot-cli add yourprovider
   ```
3. Verify the component works correctly
4. Test with both TypeScript and JavaScript projects

## Best Practices

1. **Keep it simple**: Component should be easy to understand and modify
2. **Document thoroughly**: Clear props, examples, and setup instructions
3. **Minimize dependencies**: Only include what's absolutely necessary
4. **Error handling**: Provide helpful error messages
5. **Styling**: Use CSS that doesn't conflict with user's styles
6. **Accessibility**: Follow React accessibility best practices
7. **TypeScript**: Use proper types for better DX

## Example Repositories

- `react-chatbot-openai`: OpenAI GPT integration
- `react-chatbot-anthropic`: Anthropic Claude integration (coming soon)
- `react-chatbot-gemini`: Google Gemini integration (coming soon)

## Questions?

Open an issue in the `react-chatbot-cli` repository for help creating your component.

# React Chatbot CLI

CLI tool to add chatbot components to React projects, similar to shadcn/ui.

Components are fetched from external repositories and copied directly to your project, giving you full control and ownership of the code.

## Architecture

This CLI follows a modular architecture where:
- **CLI Package** (`react-chatbot-cli`): The command-line tool that orchestrates everything
- **Component Repositories**: Separate repos for each integration (e.g., `react-chatbot-openai`, `react-chatbot-anthropic`)
- **Registry**: A centralized configuration that maps component names to their source repositories

When you run `react-chatbot-cli add openai`, the CLI:
1. Looks up the component in the registry
2. Fetches the component files from the external GitHub repository
3. Converts TypeScript to JavaScript if needed
4. Copies the files to your project

## Installation

```bash
npm install -g react-chatbot-cli
```

Or use directly with npx:

```bash
npx react-chatbot-cli init
```

## Usage

### 1. Initialize the CLI in your React project

Navigate to your React project directory and run:

```bash
react-chatbot-cli init
```

This will:
- Create a `chatbot-cli.json` configuration file
- Ask you where to place components (default: `src/components`)
- Detect if you're using TypeScript

### 2. Add a chatbot component

```bash
react-chatbot-cli add openai
```

This will:
- Fetch the component from the external repository
- Copy the Chatbot component to your components directory
- Show you which dependencies you need to install
- Display environment variables you need to configure

## Available Components

### OpenAI

A fully functional chatbot component with OpenAI integration.

**Repository:** `react-chatbot-openai` (external)

```bash
react-chatbot-cli add openai
```

**Features:**
- Clean, modern UI
- Message history management
- Loading states
- Error handling
- Customizable prompts and models
- Full TypeScript support

**Usage:**

```jsx
import { Chatbot } from './components/Chatbot/Chatbot';

function App() {
  return (
    <Chatbot
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      systemPrompt="You are a helpful assistant."
      model="gpt-3.5-turbo"
      placeholder="Ask me anything..."
      welcomeMessage="Hello! How can I help you today?"
    />
  );
}
```

**Props:**

- `apiKey` (required): Your OpenAI API key
- `systemPrompt` (optional): System prompt for the AI (default: "You are a helpful assistant.")
- `model` (optional): OpenAI model to use (default: "gpt-3.5-turbo")
- `placeholder` (optional): Input placeholder text
- `welcomeMessage` (optional): Initial message from the assistant

**Environment Variables:**

Create a `.env` file in your project root:

```env
REACT_APP_OPENAI_API_KEY=your_api_key_here
```

## Configuration

The `chatbot-cli.json` file in your project root controls where components are added:

```json
{
  "componentsPath": "src/components",
  "typescript": true
}
```

You can also set a custom GitHub owner via environment variable:

```bash
export GITHUB_OWNER=your-github-username
react-chatbot-cli add openai
```

## Component Registry

Components are defined in `src/utils/registry.ts`:

```typescript
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
```

## Creating Your Own Component Repository

To create a new chatbot component:

1. Create a new repository (e.g., `react-chatbot-anthropic`)
2. Structure your component in `src/components/Chatbot/`
3. Add it to the registry in this CLI
4. Users can then install it with `react-chatbot-cli add anthropic`

**Example repository structure:**

```
react-chatbot-anthropic/
├── src/
│   └── components/
│       └── Chatbot/
│           ├── Chatbot.tsx
│           └── Chatbot.css
├── package.json
└── README.md
```

## Development

To work on this CLI locally:

```bash
# Clone the repository
git clone <repo-url>
cd react-chatbot-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link locally for testing
npm link

# Now you can use it in other projects
cd /path/to/your/react/project
react-chatbot-cli init
```

## How It Works

Similar to shadcn/ui, this CLI:
1. **Fetches from external repositories** - Components live in their own repos
2. **Copies source code directly** - No hidden dependencies or black boxes
3. **Gives you full control** - Customize components however you need
4. **No vendor lock-in** - You own the code once it's in your project
5. **TypeScript → JavaScript conversion** - Automatically converts if needed

## Why This Architecture?

**Modular & Scalable:**
- Each integration lives in its own repository
- Easy to maintain and version independently
- Community can contribute new integrations

**Transparent:**
- You see exactly what code is being added
- No hidden npm packages
- Easy to audit and modify

**Flexible:**
- Use the components as-is or customize them
- Mix and match different integrations
- No framework lock-in

## Roadmap

Future components:
- [ ] Anthropic Claude integration (`react-chatbot-anthropic`)
- [ ] Google Gemini integration (`react-chatbot-gemini`)
- [ ] Local LLM support with Ollama (`react-chatbot-ollama`)
- [ ] Voice input/output capabilities
- [ ] Multi-language support
- [ ] Custom themes and styling options
- [ ] Message persistence and history

## Contributing

We welcome contributions! To add a new integration:

1. Create a new repository following the component structure
2. Submit a PR to add it to the registry
3. Document the component's props and usage

## License

MIT

# DeepSeek API Integration

This project uses the DeepSeek API to generate high-quality, precise content for the note editor.

## Setup

1. Create a `.env.local` file in the root of the project (if it doesn't exist)
2. Add your DeepSeek API key to the file:

```
DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

3. Replace `your-deepseek-api-key-here` with your actual DeepSeek API key

## Implementation

We're using the OpenAI SDK configured for DeepSeek's API endpoint with advanced prompt engineering to generate precise, accurate responses.

```javascript
// Create the OpenAI client configured for DeepSeek
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com', // DeepSeek's base URL
});

// Using the client to make requests with precision-focused prompts
const response = await openai.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: enrichedPrompt }],
  max_tokens: 2000,
  temperature: isTemplateRequest ? 0.7 : 0.5, // Lower temperature for more precise responses
});
```

## Smart Content Generation

The system intelligently determines whether to provide:

1. **Precise, direct responses** - When users ask specific questions, the system provides accurate, well-researched information without template placeholders.

2. **Template content** - Only when users explicitly request templates or examples, the system provides content with placeholders for personal information.

## Testing

To test the different response types, try these example prompts:

### Direct Queries (non-template responses):
- "What's the best way to handle my digital accounts after death?"
- "How should I write a meaningful goodbye letter?"
- "Legal considerations for distributing personal belongings"
- "How to set up care instructions for my pets"

### Template Requests:
- "Template for a goodbye note to my family"
- "Example of financial account instructions"
- "Format for listing my digital passwords"

## Fallback Mechanism

For local development, if you don't have a DeepSeek API key, or if the API call fails, the system will use a fallback mechanism to generate content based on the detected query type. You'll see a toast notification when this happens.

## API Usage

The DeepSeek API is used in the `/api/generate` endpoint, which takes a prompt and returns generated content in HTML format. 
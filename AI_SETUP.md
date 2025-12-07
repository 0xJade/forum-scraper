# AI Summarization Setup Guide

This application now includes AI-powered ecosystem summarization. To use this feature, you need to configure an AI API key.

## Supported AI Providers

Currently supports:
- **OpenAI** (GPT-4o-mini recommended for cost efficiency)
- **Anthropic** (Claude) - Coming soon

## Environment Variables

Add to your `.env.local` file:

```bash
# OpenAI (recommended)
OPENAI_API_KEY=your_openai_api_key_here

# Or Anthropic (when implemented)
# ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Specify provider (defaults to 'openai')
AI_PROVIDER=openai
```

## Getting an OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add it to `.env.local`

## Usage

1. Select one or more DAOs using the Multi-DAO Analysis mode
2. Wait for posts to load from all selected DAOs
3. Click "Generate Ecosystem Summary" button
4. Wait for AI analysis (typically 10-30 seconds)
5. View categorized, color-coded summary

## Cost Considerations

- Uses GPT-4o-mini by default (cost-effective)
- Processes up to 50 posts per request
- Responses are cached to reduce API calls
- Consider upgrading to GPT-4 for more detailed analysis

## Rate Limits

- OpenAI: Check your plan's rate limits
- The app batches requests to stay within limits
- If you hit rate limits, wait a few minutes and try again

## Troubleshooting

### "AI API key not configured" error
- Ensure `OPENAI_API_KEY` is set in `.env.local`
- Restart your dev server after adding the key

### "Failed to generate summary" error
- Check your API key is valid
- Verify you have credits/quota available
- Check network connection
- Review server logs for detailed error messages

### Slow generation
- Normal for large datasets (10-30 seconds)
- Consider reducing number of posts analyzed
- Upgrade to faster model if needed

## Security Notes

- Never commit `.env.local` to version control
- API keys are server-side only (not exposed to client)
- Use environment variables for all sensitive data


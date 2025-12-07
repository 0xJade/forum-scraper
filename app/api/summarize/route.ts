import { NextRequest, NextResponse } from 'next/server';
import { SummaryRequest, AISummary, PostForAnalysis } from '@/types/ai-summary';
import { CategoryType } from '@/types/category';
import { CATEGORY_COLORS } from '@/config/colors';

const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; // 'openai' or 'anthropic'
// Select API key based on provider to avoid using wrong key
const AI_API_KEY = AI_PROVIDER === 'openai' 
  ? process.env.OPENAI_API_KEY 
  : process.env.ANTHROPIC_API_KEY;
const MAX_TOKENS = 4000;
const MAX_POSTS_PER_BATCH = 50;

/**
 * Create AI prompt for summarization
 */
function createSummarizationPrompt(posts: PostForAnalysis[], daos: string[]): string {
  const postsText = posts
    .map(
      (post, idx) => `
Post ${idx + 1}:
- Title: ${post.title}
- Author: ${post.author}
- DAO: ${post.dao}
- Date: ${post.timestamp}
- Tags: ${post.tags.join(', ') || 'None'}
- Engagement: ${post.engagement.views} views, ${post.engagement.likes} likes, ${post.engagement.replies} replies
- Content: ${post.content.substring(0, 500)}${post.content.length > 500 ? '...' : ''}
`
    )
    .join('\n');

  return `You are analyzing forum posts from multiple DAO communities. Your task is to:

1. Generate an executive summary (2-3 sentences) of overall ecosystem activity across these DAOs: ${daos.join(', ')}

2. Identify 3-5 key themes and topics across all posts. For each theme, provide:
   - Theme name
   - Brief description
   - List of relevant post IDs
   - Relevance level (high, medium, low)

3. Categorize each post into exactly one of these categories:
   - governance: Proposals, voting, treasury decisions
   - technical: Development updates, technical discussions, bug reports
   - community: General discussions, onboarding, community building
   - partnerships: Collaborations, integrations, partnerships
   - education: Tutorials, documentation, learning resources
   - announcements: Important updates, launches, milestones
   - support: Help requests, troubleshooting, Q&A
   - meta: Forum governance, process improvements, meta-discussions

4. Assess overall community sentiment (positive, neutral, negative, or mixed) with details

5. Identify cross-DAO patterns or trends (if multiple DAOs provided)

6. Highlight any action items or important governance decisions

Return a JSON object with this exact structure:
{
  "executiveSummary": "string (2-3 sentences)",
  "keyThemes": [
    {
      "theme": "string",
      "description": "string",
      "postIds": [number],
      "relevance": "high" | "medium" | "low"
    }
  ],
  "categories": [
    {
      "category": "governance" | "technical" | "community" | "partnerships" | "education" | "announcements" | "support" | "meta",
      "summary": "string (brief summary of discussions in this category)",
      "postIds": [number]
    }
  ],
  "sentiment": {
    "overall": "positive" | "neutral" | "negative" | "mixed",
    "details": "string (explanation of sentiment)"
  },
  "crossDaoInsights": ["string"] (optional, only if multiple DAOs),
  "actionItems": ["string"] (optional)
}

Posts to analyze:
${postsText}

Return only valid JSON, no markdown formatting.`;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt: string): Promise<string> {
  if (!AI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // Using mini for cost efficiency, can be upgraded
      messages: [
        {
          role: 'system',
          content:
            'You are an expert analyst specializing in DAO ecosystems, governance, and community analysis. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * Process AI response and format into AISummary
 */
function processAIResponse(
  aiResponse: string,
  posts: PostForAnalysis[],
  daos: string[]
): AISummary {
  let parsed: {
    executiveSummary?: string;
    keyThemes?: Array<{ theme: string; description: string; postIds: number[]; relevance?: string }>;
    categories?: Array<{ category: string; summary: string; postIds: number[] }>;
    sentiment?: { overall?: string; details?: string };
    crossDaoInsights?: string[];
    actionItems?: string[];
  };

  try {
    // Try to parse JSON (remove markdown code blocks if present)
    const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Invalid AI response format');
  }

  // Create post map for quick lookup
  const postMap = new Map(posts.map((p) => [p.id, p]));

  // Process categories
  const categories = (parsed.categories || []).map((cat) => {
    const categoryType = cat.category as CategoryType;
    const categoryPosts = cat.postIds
      .map((id) => postMap.get(id))
      .filter((p): p is PostForAnalysis => p !== undefined);

    return {
      category: categoryType,
      color: CATEGORY_COLORS[categoryType]?.hex || '#6B7280',
      posts: categoryPosts,
      summary: cat.summary || '',
      count: categoryPosts.length,
    };
  });

  // Process key themes
  const keyThemes = (parsed.keyThemes || []).map((theme) => ({
    theme: theme.theme || 'Unnamed Theme',
    description: theme.description || '',
    postIds: theme.postIds || [],
    relevance: (theme.relevance || 'medium') as 'high' | 'medium' | 'low',
  }));

  return {
    executiveSummary: parsed.executiveSummary || 'No summary available',
    keyThemes,
    categories,
    sentiment: {
      overall: (parsed.sentiment?.overall || 'neutral') as 'positive' | 'neutral' | 'negative' | 'mixed',
      details: parsed.sentiment?.details || 'Sentiment analysis unavailable',
    },
    crossDaoInsights: parsed.crossDaoInsights,
    actionItems: parsed.actionItems,
    generatedAt: new Date().toISOString(),
    daoCount: daos.length,
    totalPosts: posts.length,
  };
}

/**
 * POST /api/summarize
 * Generate AI summary from posts
 */
export async function POST(request: NextRequest) {
  try {
    console.log("whatsup?")
    console.log(AI_API_KEY);
    console.log(AI_PROVIDER);
    if (!AI_API_KEY) {
      const keyName = AI_PROVIDER === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY';
      return NextResponse.json(
        { error: `AI API key not configured. Please set ${keyName} environment variable for ${AI_PROVIDER} provider.` },
        { status: 500 }
      );
    }

    const body: SummaryRequest = await request.json();

    if (!body.posts || body.posts.length === 0) {
      return NextResponse.json({ error: 'No posts provided' }, { status: 400 });
    }

    if (!body.daos || body.daos.length === 0) {
      return NextResponse.json({ error: 'No DAOs specified' }, { status: 400 });
    }

    // Limit posts to prevent token overflow
    const postsToAnalyze = body.posts.slice(0, MAX_POSTS_PER_BATCH);
    if (body.posts.length > MAX_POSTS_PER_BATCH) {
      console.warn(`Limiting analysis to ${MAX_POSTS_PER_BATCH} posts out of ${body.posts.length}`);
    }

    // Create prompt
    const prompt = createSummarizationPrompt(postsToAnalyze, body.daos);

    // Call AI API
    let aiResponse: string;
    if (AI_PROVIDER === 'anthropic') {
      // TODO: Implement Anthropic API call
      throw new Error('Anthropic API not yet implemented');
    } else {
      aiResponse = await callOpenAI(prompt);
    }

    // Process response
    const summary = processAIResponse(aiResponse, postsToAnalyze, body.daos);

    return NextResponse.json(summary, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error generating AI summary:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred while generating summary';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


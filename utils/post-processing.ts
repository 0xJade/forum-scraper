import { Post, TopicDetailsResponse } from '@/types/topic';
import { PostForAnalysis } from '@/types/ai-summary';

/**
 * Strip HTML tags from a string, preserving text content
 */
export function stripHtml(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Replace common HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * Convert a post to PostForAnalysis format
 */
export function convertPostForAnalysis(
  post: Post,
  topicTitle: string,
  daoName: string,
  forumBaseUrl: string,
  topicId: number
): PostForAnalysis {
  return {
    id: post.id,
    title: topicTitle,
    content: stripHtml(post.cooked || ''),
    author: post.name || post.username || 'Anonymous',
    timestamp: post.created_at,
    dao: daoName,
    tags: [], // Will be populated from topic if available
    engagement: {
      views: 0, // Will be populated from topic if available
      likes: 0,
      replies: 0,
    },
    url: `${forumBaseUrl}/t/${topicId}/${post.post_number}`,
    topicId,
    postNumber: post.post_number,
  };
}

/**
 * Convert topic details response to PostForAnalysis array
 */
export function convertTopicDetailsToPosts(
  topicDetails: TopicDetailsResponse,
  daoName: string,
  forumBaseUrl: string
): PostForAnalysis[] {
  const posts = topicDetails.post_stream?.posts || [];
  const topicTitle = topicDetails.fancy_title || topicDetails.title;

  return posts.map((post) => {
    const analysisPost = convertPostForAnalysis(
      post,
      topicTitle,
      daoName,
      forumBaseUrl,
      topicDetails.id
    );

    // Add topic-level metadata
    analysisPost.tags = topicDetails.tags || [];
    analysisPost.engagement.views = topicDetails.views || 0;
    analysisPost.engagement.likes = topicDetails.like_count || 0;
    analysisPost.engagement.replies = topicDetails.reply_count || 0;

    return analysisPost;
  });
}

/**
 * Truncate content to a maximum length for AI processing
 */
export function truncateContent(content: string, maxLength: number = 2000): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '...';
}


import { CategoryType } from './category';

export interface PostForAnalysis {
  id: number;
  title: string;
  content: string; // Stripped HTML from post.cooked
  author: string;
  timestamp: string;
  dao: string; // Source DAO name
  tags: string[];
  engagement: {
    views: number;
    likes: number;
    replies: number;
  };
  url?: string; // Link back to original post
  topicId: number;
  postNumber: number;
}

export interface KeyTheme {
  theme: string;
  description: string;
  postIds: number[];
  relevance: 'high' | 'medium' | 'low';
}

export interface CategorySummary {
  category: CategoryType;
  color: string;
  posts: PostForAnalysis[];
  summary: string;
  count: number;
}

export type SentimentType = 'positive' | 'neutral' | 'negative' | 'mixed';

export interface AISummary {
  executiveSummary: string;
  keyThemes: KeyTheme[];
  categories: CategorySummary[];
  sentiment: {
    overall: SentimentType;
    details: string;
  };
  crossDaoInsights?: string[];
  actionItems?: string[];
  generatedAt: string;
  daoCount: number;
  totalPosts: number;
}

export interface SummaryRequest {
  posts: PostForAnalysis[];
  daos: string[];
  dateRange: {
    start: string;
    end: string;
  };
}


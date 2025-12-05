export interface Topic {
  id: number;
  title: string;
  created_at: string; // ISO 8601 format: "2024-07-24T21:14:55.364Z"
}

export interface TopicFull {
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  created_at: string;
  last_posted_at: string;
  views: number;
  like_count: number;
  tags: string[];
  [key: string]: unknown; // Allow other fields from API (type-safe)
}

export interface User {
  id: number;
  username: string;
  name: string;
  avatar_template: string;
  [key: string]: unknown; // Allow other fields from API (type-safe)
}

export interface ForumResponse {
  users: User[];
  primary_groups: unknown[]; // Groups structure varies by forum
  flair_groups: unknown[]; // Flair groups structure varies by forum
  topic_list: {
    can_create_topic: boolean;
    more_topics_url: string;
    per_page: number;
    top_tags: string[];
    topics: TopicFull[];
  };
}

export interface Post {
  id: number;
  name: string;
  username: string;
  avatar_template: string;
  created_at: string;
  cooked: string;
  post_number: number;
  [key: string]: unknown; // Allow other fields from API (type-safe)
}

export interface TopicDetailsResponse {
  post_stream: {
    posts: Post[];
  };
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  created_at: string;
  last_posted_at: string;
  views: number;
  like_count: number;
  tags: string[];
  [key: string]: unknown; // Allow other fields from API (type-safe)
}

export interface TopicStatistics {
  totalPosts: number;
  uniqueTopics: number;
  dateRange: {
    start: string;
    end: string;
  };
}


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
  [key: string]: any; // Allow other fields from API
}

export interface User {
  id: number;
  username: string;
  name: string;
  avatar_template: string;
  [key: string]: any;
}

export interface ForumResponse {
  users: User[];
  primary_groups: any[];
  flair_groups: any[];
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
  [key: string]: any;
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
  [key: string]: any;
}

export interface TopicStatistics {
  totalPosts: number;
  uniqueTopics: number;
  dateRange: {
    start: string;
    end: string;
  };
}


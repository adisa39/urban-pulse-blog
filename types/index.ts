// Re-export ApiPost as Post for component compatibility
export type { ApiPost as Post } from '@/lib/hooks';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  featuredPosts: number;
  categories: number;
}

export const CATEGORIES = ['News', 'Scholarship', 'Sport', 'Entertainment', 'Jobs', 'Politics', 'Others'] as const;
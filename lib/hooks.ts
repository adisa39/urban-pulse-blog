'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ApiPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: { id: string; name: string }[];
  author: {
    id: string;
    name: string;
    avatar: string | null;
    bio: string | null;
    twitterHandle: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
  };
  published: boolean;
  featured: boolean;
  views: number;
  readTime: number;
  metaDescription: string | null;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
}

export interface PostsResponse {
  posts: ApiPost[];
  total: number;
  page: number;
  pages: number;
}

interface FetchOptions {
  admin?: boolean;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export function usePosts(options: FetchOptions = {}) {
  const [data, setData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildUrl = useCallback((opts: FetchOptions) => {
    const params = new URLSearchParams();
    if (opts.admin) params.set('admin', 'true');
    if (opts.category) params.set('category', opts.category);
    if (opts.tag) params.set('tag', opts.tag);
    if (opts.search) params.set('search', opts.search);
    if (opts.featured) params.set('featured', 'true');
    if (opts.page) params.set('page', String(opts.page));
    if (opts.limit) params.set('limit', String(opts.limit));
    return `/api/posts?${params}`;
  }, []);

  const fetch_ = useCallback(async (opts: FetchOptions) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildUrl(opts));
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => { fetch_(options); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => fetch_(options), [fetch_, options]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch };
}

export async function createPost(payload: Partial<ApiPost> & { tags: string[] }) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const e = await res.json();
    throw new Error(e.error || 'Create failed');
  }
  return res.json() as Promise<ApiPost>;
}

export async function updatePost(id: string, payload: Partial<ApiPost> & { tags?: string[] }) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const e = await res.json();
    throw new Error(e.error || 'Update failed');
  }
  return res.json() as Promise<ApiPost>;
}

export async function patchPost(id: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Patch failed');
  return res.json() as Promise<ApiPost>;
}

export async function deletePost(id: string) {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}

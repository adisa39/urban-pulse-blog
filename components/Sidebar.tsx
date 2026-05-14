'use client';

import { ApiPost } from '@/lib/hooks';
import PostCard from './PostCard';
import AdSpace from './AdSpace';
import { TrendingUp, Tag } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  popularPosts: ApiPost[];
  allTags: string[];
}

export default function Sidebar({ popularPosts, allTags }: SidebarProps) {
  const categories = ['Technology', 'Design', 'Business', 'Science', 'Culture'];

  return (
    <aside className="space-y-8">
      {/* Sidebar rectangle ad */}
      <AdSpace variant="rectangle" />

      {/* Popular posts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
          <h3 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Trending</h3>
        </div>
        <div>
          {popularPosts.slice(0, 5).map(post => (
            <PostCard key={post.id} post={post} variant="compact" />
          ))}
          {popularPosts.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No posts yet.</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-serif font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Categories</h3>
        <div className="space-y-1">
          {categories.map(cat => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--accent-light)';
                (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              }}
            >
              {cat}
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag size={15} style={{ color: 'var(--accent)' }} />
            <h3 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 20).map(tag => (
              <Link key={tag} href={`/tag/${encodeURIComponent(tag.toLowerCase())}`} className="tag">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Second ad slot */}
      <AdSpace variant="square" label="250 × 250" />
    </aside>
  );
}

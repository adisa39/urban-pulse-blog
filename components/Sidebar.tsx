'use client';

import { Post } from '@/types';
import PostCard from './PostCard';
import AdSpace from './AdSpace';
import { TrendingUp, Tag } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  popularPosts: Post[];
  allTags: string[];
}

export default function Sidebar({ popularPosts, allTags }: SidebarProps) {
  const categories = ['Technology', 'Design', 'Business', 'Science', 'Culture'];

  return (
    <aside className="space-y-8">
      {/* Ad — sidebar rectangle */}
      <AdSpace variant="rectangle" />

      {/* Popular posts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
          <h3 className="font-serif font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Popular This Week
          </h3>
        </div>
        <div>
          {popularPosts.slice(0, 5).map(post => (
            <PostCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-serif font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
          Browse Topics
        </h3>
        <div className="space-y-1">
          {categories.map(cat => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="flex items-center justify-between px-3 py-2 rounded-lg transition-all group"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--accent-light)';
                el.style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.color = 'var(--text-secondary)';
              }}
            >
              <span className="text-sm font-medium">{cat}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40 group-hover:opacity-100 transition-opacity">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags cloud */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Tag size={15} style={{ color: 'var(--accent)' }} />
          <h3 className="font-serif font-bold text-base" style={{ color: 'var(--text-primary)' }}>Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Link key={tag} href={`/tag/${encodeURIComponent(tag.toLowerCase())}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Ad — skyscraper */}
      <AdSpace variant="sidebar" />

      {/* Newsletter mini */}
      <div
        className="p-5 rounded-2xl text-white text-center"
        style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #7a5f3e 100%)' }}
      >
        <h4 className="font-serif font-bold text-lg mb-2">Never miss a story</h4>
        <p className="text-xs opacity-80 mb-4">Join 8,000+ readers. Unsubscribe anytime.</p>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-3 py-2 rounded-lg text-sm mb-2 outline-none"
          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
        />
        <button
          className="w-full py-2 rounded-lg text-sm font-bold transition hover:opacity-90"
          style={{ background: '#fff', color: 'var(--accent)' }}
        >
          Subscribe Free
        </button>
      </div>
    </aside>
  );
}

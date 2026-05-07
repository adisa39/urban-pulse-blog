'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import {
  TrendingUp, Eye, FileText, Star, BarChart2,
  ArrowUpRight, Clock, Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  featuredPosts: number;
  categories: number;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?stats=true').then(r => r.json()),
      fetch('/api/posts?admin=true').then(r => r.json()),
    ]).then(([s, p]) => {
      setStats(s);
      setPosts(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const topPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
  const byCategory = posts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.views;
    return acc;
  }, {} as Record<string, number>);
  const maxCatViews = Math.max(...Object.values(byCategory), 1);
  const postCountByCategory = posts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, string> = {
    Technology: '#3b82f6',
    Design: '#8b5cf6',
    Business: '#10b981',
    Science: '#14b8a6',
    Culture: '#f59e0b',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Overview of your blog performance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Views', value: (stats?.totalViews || 0).toLocaleString(), icon: Eye, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Published Posts', value: stats?.publishedPosts || 0, icon: FileText, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Draft Posts', value: stats?.draftPosts || 0, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Featured Posts', value: stats?.featuredPosts || 0, icon: Star, color: 'var(--accent)', bg: 'var(--accent-light)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={17} style={{ color }} />
              </div>
              <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="stat-value">{value}</p>
            <p className="stat-label">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Views by category */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={16} style={{ color: 'var(--accent)' }} />
            <h2 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Views by Category</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, views]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: categoryColors[cat] || 'var(--accent)' }}
                      />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cat}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {views.toLocaleString()}
                      </span>
                      <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                        ({postCountByCategory[cat] || 0} posts)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(views / maxCatViews) * 100}%`,
                        background: categoryColors[cat] || 'var(--accent)',
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top posts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
              <h2 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Top Posts</h2>
            </div>
            <Link href="/admin/posts" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: i === 0 ? 'var(--accent)' : 'var(--accent-light)',
                    color: i === 0 ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {i + 1}
                </span>
                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {post.views.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content breakdown */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users size={16} style={{ color: 'var(--accent)' }} />
          <h2 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Content Overview</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Avg Views/Post', value: posts.length ? Math.round((stats?.totalViews || 0) / posts.length).toLocaleString() : '0' },
            { label: 'Total Articles', value: (stats?.totalPosts || 0).toLocaleString() },
            { label: 'Publish Rate', value: stats ? `${Math.round((stats.publishedPosts / Math.max(stats.totalPosts, 1)) * 100)}%` : '0%' },
            { label: 'Categories Active', value: Object.keys(byCategory).length },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
              <p className="font-serif text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

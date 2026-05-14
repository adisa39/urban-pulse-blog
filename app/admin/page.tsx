'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ApiPost } from '@/lib/hooks';
import { Eye, FileText, Star, Clock, TrendingUp, PenSquare, ArrowUpRight, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Stats { totalPosts: number; publishedPosts: number; draftPosts: number; totalViews: number; featuredPosts: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?stats=true').then(r => r.ok ? r.json() : null),
      fetch('/api/posts?admin=true&limit=10').then(r => r.ok ? r.json() : null),
    ]).then(([s, p]) => {
      setStats(s);
      setPosts(p?.posts || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const topPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
  const recentPosts = [...posts].slice(0, 5);

  const statCards = [
    { label: 'Total Views', value: stats?.totalViews?.toLocaleString() || '—', icon: Eye, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', href: '/admin/analytics' },
    { label: 'Published', value: stats?.publishedPosts ?? '—', icon: FileText, color: '#10b981', bg: 'rgba(16,185,129,0.1)', href: '/admin/posts' },
    { label: 'Drafts', value: stats?.draftPosts ?? '—', icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', href: '/admin/posts' },
    { label: 'Featured', value: stats?.featuredPosts ?? '—', icon: Star, color: 'var(--accent)', bg: 'var(--accent-light)', href: '/admin/posts' },
  ];

  if (loading) return (
    <div>
      <div className="mb-8"><div className="h-8 w-48 rounded-xl animate-pulse" style={{ background: 'var(--bg-secondary)' }} /></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="stat-card animate-pulse" style={{ height: 110, background: 'var(--bg-secondary)' }} />)}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>
        <Link href="/admin/new" className="btn-primary">
          <PenSquare size={15} /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="stat-card group transition hover:border-accent cursor-pointer" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={17} style={{ color }} />
              </div>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="stat-value mt-3">{value}</p>
            <p className="stat-label">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent posts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: 'var(--accent)' }} />
              <h2 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Recent Posts</h2>
            </div>
            <Link href="/admin/posts" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>View all →</Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map(post => (
              <div key={post.id} className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/posts/${post.id}`} className="text-sm font-semibold line-clamp-1 hover:underline" style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="category-badge text-xs">{post.category}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{format(new Date(post.publishedAt), 'MMM d')}</span>
                    <span className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: post.published ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: post.published ? '#059669' : '#d97706' }}>
                      {post.published ? '● Live' : '● Draft'}
                    </span>
                  </div>
                </div>
                <Link href={`/admin/posts/${post.id}`} className="p-1.5 rounded-lg flex-shrink-0 transition hover:scale-110" style={{ color: 'var(--accent)' }}>
                  <PenSquare size={13} />
                </Link>
              </div>
            ))}
            {recentPosts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No posts yet.</p>
                <Link href="/admin/new" className="btn-primary mt-3 text-sm">Create first post</Link>
              </div>
            )}
          </div>
        </div>

        {/* Top posts by views */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
              <h2 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Top Posts</h2>
            </div>
            <Link href="/admin/analytics" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Analytics →</Link>
          </div>
          <div className="space-y-3">
            {topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: i === 0 ? 'var(--accent)' : 'var(--accent-light)', color: i === 0 ? '#fff' : 'var(--text-muted)' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{post.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{post.views.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>views</p>
                </div>
              </div>
            ))}
            {topPosts.length === 0 && <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No data yet.</p>}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {[
          { label: 'Write an Article', desc: 'Start a new blog post', href: '/admin/new', icon: PenSquare },
          { label: 'View Analytics', desc: 'Check post performance', href: '/admin/analytics', icon: TrendingUp },
          { label: 'Manage Tags', desc: 'Organise your content', href: '/admin/tags', icon: Users },
        ].map(({ label, desc, href, icon: Icon }) => (
          <Link key={href} href={href} className="card p-5 group flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition group-hover:scale-105" style={{ background: 'var(--accent-light)' }}>
              <Icon size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import {
  FileText, Eye, Star, TrendingUp, PenSquare,
  ArrowUpRight, Clock, Check, AlertCircle
} from 'lucide-react';

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  featuredPosts: number;
  categories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?stats=true').then(r => r.json()),
      fetch('/api/posts?admin=true').then(r => r.json()),
    ]).then(([s, p]) => {
      setStats(s);
      setRecentPosts(p.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: '#3b82f6', sub: `${stats.draftPosts} drafts` },
    { label: 'Published', value: stats.publishedPosts, icon: Check, color: '#10b981', sub: 'live articles' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: '#8b5cf6', sub: 'all time' },
    { label: 'Featured', value: stats.featuredPosts, icon: Star, color: '#f59e0b', sub: 'highlighted posts' },
  ] : [];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Welcome back. Here&apos;s what&apos;s happening with your blog.
          </p>
        </div>
        <Link href="/admin/new" className="btn-primary">
          <PenSquare size={15} /> New Post
        </Link>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse" style={{ background: 'var(--bg-secondary)' }}>
              <div className="h-8 rounded" style={{ background: 'var(--border)' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="stat-card">
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <TrendingUp size={14} style={{ color: '#10b981' }} />
              </div>
              <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent posts table */}
      <div className="card overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-serif font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Recent Posts</h2>
          <Link href="/admin/posts" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>
            View all <ArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse h-12 rounded-lg" style={{ background: 'var(--bg-secondary)' }} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="hidden sm:table-cell">Category</th>
                  <th className="hidden md:table-cell">Views</th>
                  <th>Status</th>
                  <th className="hidden lg:table-cell">Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div className="flex items-start gap-2">
                        {post.featured && <Star size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#f59e0b' }} />}
                        <span className="font-medium line-clamp-1 text-sm" style={{ color: 'var(--text-primary)', maxWidth: 220 }}>
                          {post.title}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="category-badge text-xs">{post.category}</span>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Eye size={12} /> {post.views.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: post.published ? '#d1fae5' : '#fef3c7',
                          color: post.published ? '#065f46' : '#92400e',
                        }}
                      >
                        {post.published ? <Check size={10} /> : <Clock size={10} />}
                        {post.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell text-sm" style={{ color: 'var(--text-muted)' }}>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/edit/${post.id}`}
                          className="text-xs font-semibold px-2 py-1 rounded-md"
                          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-xs"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Write New Post', desc: 'Start from a blank canvas', href: '/admin/new', icon: PenSquare, color: 'var(--accent)' },
          { label: 'View Analytics', desc: 'See how your content performs', href: '/admin/analytics', icon: TrendingUp, color: '#8b5cf6' },
          { label: 'Manage Tags', desc: 'Organize your content taxonomy', href: '/admin/tags', icon: AlertCircle, color: '#f59e0b' },
        ].map(({ label, desc, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="card p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

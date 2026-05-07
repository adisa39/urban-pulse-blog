'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { Search, Filter, ArrowUpRight, Trash2, Edit3, Star, Eye, Check, Clock, Plus } from 'lucide-react';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/posts?admin=true')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const handleTogglePublish = async (post: Post) => {
    setToggling(post.id);
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPosts(prev => prev.map(p => p.id === post.id ? updated : p));
    }
    setToggling(null);
  };

  const handleToggleFeatured = async (post: Post) => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !post.featured }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPosts(prev => prev.map(p => p.id === post.id ? updated : p));
    }
  };

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || (statusFilter === 'published' ? p.published : !p.published);
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>All Posts</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{posts.length} total articles</p>
        </div>
        <Link href="/admin/new" className="btn-primary self-start sm:self-auto">
          <Plus size={15} /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="form-input pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="form-input pl-8 pr-8 cursor-pointer text-sm"
              style={{ appearance: 'none', minWidth: 130 }}
            >
              {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
            </select>
          </div>
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            {(['all', 'published', 'draft'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all"
                style={{
                  background: statusFilter === s ? 'var(--accent)' : 'transparent',
                  color: statusFilter === s ? '#fff' : 'var(--text-muted)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center" style={{ color: 'var(--text-muted)' }}>
            No posts match your filters.
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
                  <th className="hidden lg:table-cell">Read Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div className="flex items-start gap-2 min-w-0">
                        <button
                          onClick={() => handleToggleFeatured(post)}
                          title={post.featured ? 'Unfeature' : 'Feature'}
                          className="mt-0.5 flex-shrink-0 transition-opacity hover:opacity-60"
                        >
                          <Star
                            size={14}
                            fill={post.featured ? '#f59e0b' : 'none'}
                            style={{ color: post.featured ? '#f59e0b' : 'var(--border)' }}
                          />
                        </button>
                        <span className="font-medium text-sm line-clamp-2" style={{ color: 'var(--text-primary)', maxWidth: 240 }}>
                          {post.title}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="category-badge">{post.category}</span>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Eye size={12} /> {post.views.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(post)}
                        disabled={toggling === post.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer hover:opacity-75"
                        style={{
                          background: post.published ? '#d1fae5' : '#fef3c7',
                          color: post.published ? '#065f46' : '#92400e',
                        }}
                        title={`Click to ${post.published ? 'unpublish' : 'publish'}`}
                      >
                        {post.published ? <Check size={10} /> : <Clock size={10} />}
                        {toggling === post.id ? '…' : post.published ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="hidden lg:table-cell text-sm" style={{ color: 'var(--text-muted)' }}>
                      {post.readTime} min
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/edit/${post.id}`}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--accent)', background: 'var(--accent-light)' }}
                          title="Edit"
                        >
                          <Edit3 size={13} />
                        </Link>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}
                          title="View"
                        >
                          <ArrowUpRight size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: '#dc2626', background: '#fee2e2' }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: 'var(--text-muted)' }}>
        Showing {filtered.length} of {posts.length} posts
      </p>
    </div>
  );
}

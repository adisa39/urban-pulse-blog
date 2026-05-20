'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ApiPost, patchPost, deletePost } from '@/lib/hooks';
import { Search, ExternalLink, Trash2, PenSquare, Eye, EyeOff, Star, StarOff, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { CATEGORIES } from '@/types';

type SortKey = 'publishedAt' | 'title' | 'views' | 'category';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('publishedAt');
  const [sortAsc, setSortAsc] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/posts?admin=true&limit=100')
      .then(r => r.json())
      .then(data => { setPosts(data.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (post: ApiPost, field: 'published' | 'featured') => {
    const updated = await patchPost(post.id, { [field]: !post[field] });
    setPosts(prev => prev.map(p => p.id === post.id ? updated : p));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    await deletePost(id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = posts
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q);
      const matchCat = filterCat === 'all' || p.category === filterCat;
      const matchStatus = filterStatus === 'all' || (filterStatus === 'published' ? p.published : !p.published);
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'publishedAt') cmp = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      else if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortKey === 'views') cmp = a.views - b.views;
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
      return sortAsc ? cmp : -cmp;
    });

  const handleSort = (key: SortKey) => { if (sortKey === key) setSortAsc(!sortAsc); else { setSortKey(key); setSortAsc(false); } };
  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
    : <ChevronDown size={13} className="opacity-20" />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>All Posts</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {posts.length} total · {posts.filter(p => p.published).length} published · {posts.filter(p => !p.published).length} drafts
          </p>
        </div>
        <Link href="/admin/new" className="btn-primary"><Plus size={15} /> New Post</Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…" className="form-input pl-9" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="form-input w-full sm:w-44">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')} className="form-input w-full sm:w-36">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="animate-pulse h-16 rounded-xl" style={{ background: 'var(--bg-secondary)' }} />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th><button className="flex items-center gap-1" onClick={() => handleSort('title')}>Post <SortIcon k="title" /></button></th>
                  <th className="hidden md:table-cell"><button className="flex items-center gap-1" onClick={() => handleSort('category')}>Category <SortIcon k="category" /></button></th>
                  <th className="hidden sm:table-cell">Status</th>
                  <th className="hidden lg:table-cell"><button className="flex items-center gap-1" onClick={() => handleSort('views')}>Views <SortIcon k="views" /></button></th>
                  <th className="hidden lg:table-cell"><button className="flex items-center gap-1" onClick={() => handleSort('publishedAt')}>Date <SortIcon k="publishedAt" /></button></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate max-w-xs" style={{ color: 'var(--text-primary)' }}>{post.title}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>by {post.author.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell"><span className="category-badge">{post.category}</span></td>
                    <td className="hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: post.published ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: post.published ? '#059669' : '#d97706' }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      {post.featured && <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(145,117,74,0.12)', color: 'var(--accent)' }}>★</span>}
                    </td>
                    <td className="hidden lg:table-cell"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>{post.views.toLocaleString()}</span></td>
                    <td className="hidden lg:table-cell"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 rounded-lg transition hover:scale-110" style={{ color: 'var(--text-muted)' }} title="View live"><ExternalLink size={14} /></Link>
                        <button onClick={() => handleToggle(post, 'published')} className="p-1.5 rounded-lg transition hover:scale-110" style={{ color: post.published ? '#059669' : 'var(--text-muted)' }} title={post.published ? 'Unpublish' : 'Publish'}>
                          {post.published ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button onClick={() => handleToggle(post, 'featured')} className="p-1.5 rounded-lg transition hover:scale-110" style={{ color: post.featured ? 'var(--accent)' : 'var(--text-muted)' }} title={post.featured ? 'Unfeature' : 'Feature'}>
                          {post.featured ? <Star size={14} /> : <StarOff size={14} />}
                        </button>
                        <Link href={`/admin/posts/${post.id}`} className="p-1.5 rounded-lg transition hover:scale-110" style={{ color: 'var(--accent)' }} title="Edit"><PenSquare size={14} /></Link>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg transition hover:scale-110" style={{ color: '#ef4444' }} title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="font-serif text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No posts found</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {search || filterCat !== 'all' || filterStatus !== 'all' ? 'Try adjusting your filters.' : 'Create your first post!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

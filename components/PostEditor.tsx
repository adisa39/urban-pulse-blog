'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ApiPost, createPost, updatePost } from '@/lib/hooks';
import { Save, Eye, X, Plus, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface PostEditorProps {
  initial?: Partial<ApiPost>;
  postId?: string;
  mode: 'create' | 'edit';
}

const CATEGORIES = ['News', 'Scholarship', 'Sport', 'Entertainment', 'Jobs', 'Politics', 'Others'] as const;
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=630&fit=crop';

export default function PostEditor({ initial, postId, mode }: PostEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState({
    title:           initial?.title || '',
    excerpt:         initial?.excerpt || '',
    content:         initial?.content || '',
    coverImage:      initial?.coverImage || DEFAULT_COVER,
    category:        initial?.category || 'News',
    tags:            (initial?.tags?.map(t => t.name) || []) as string[],
    published:       initial?.published ?? false,
    featured:        initial?.featured ?? false,
    metaDescription: initial?.metaDescription || '',
  });

  const update = (field: string, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) update('tags', [...form.tags, tag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => update('tags', form.tags.filter(t => t !== tag));

  const wordCount = form.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = async (publishOverride?: boolean) => {
    if (!form.title.trim()) { setStatus({ type: 'error', msg: 'Title is required.' }); return; }
    if (!form.content.trim()) { setStatus({ type: 'error', msg: 'Content is required.' }); return; }

    setSaving(true);
    setStatus(null);

    const payload = {
      ...form,
      published: publishOverride !== undefined ? publishOverride : form.published,
      metaDescription: form.metaDescription || form.excerpt,
    };

    try {
      if (mode === 'create') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createPost(payload as any);
        setStatus({ type: 'success', msg: 'Post created successfully!' });
        setTimeout(() => router.push('/admin/posts'), 1200);
      } else if (postId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updatePost(postId, payload as any);
        setStatus({ type: 'success', msg: 'Post saved.' });
        update('published', payload.published);
      }
    } catch (e) {
      setStatus({ type: 'error', msg: e instanceof Error ? e.message : 'Something went wrong.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {mode === 'create' ? 'New Post' : 'Edit Post'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {mode === 'create' ? 'Create a new article for your blog.' : `Last saved: ${initial?.updatedAt ? new Date(initial.updatedAt).toLocaleString() : '—'}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {form.published && mode === 'edit' && initial?.slug && (
            <a href={`/blog/${initial.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary py-1.5 px-3 text-sm">
              <Eye size={14} /> Preview
            </a>
          )}
          <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary py-1.5 px-3 text-sm">
            {saving ? <Loader size={13} className="animate-spin" /> : null} Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary py-1.5 px-3 text-sm">
            {saving ? <Loader size={13} className="animate-spin" /> : <Save size={14} />}
            {form.published ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {status && (
        <div className="flex items-center gap-2 p-3 rounded-xl mb-6 text-sm font-medium animate-fade-in-up" style={{
          background: status.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          color: status.type === 'success' ? '#059669' : '#dc2626',
          border: `1px solid ${status.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
        }}>
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {status.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="form-label">Title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Write a compelling headline…" className="form-input text-lg font-serif" />
          </div>

          <div>
            <label className="form-label">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => update('excerpt', e.target.value)} placeholder="A 1–2 sentence summary shown in article cards and social previews…" rows={3} className="form-input resize-none" />
            <p className="text-xs mt-1" style={{ color: form.excerpt.length > 200 ? '#ef4444' : 'var(--text-muted)' }}>{form.excerpt.length}/200</p>
          </div>

          <div>
            <label className="form-label">Cover Image URL</label>
            <input type="url" value={form.coverImage} onChange={e => update('coverImage', e.target.value)} placeholder="https://images.unsplash.com/…" className="form-input" />
            {form.coverImage && (
              <div className="mt-2 relative overflow-hidden rounded-xl" style={{ height: 160 }}>
                <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" unoptimized onError={() => update('coverImage', DEFAULT_COVER)} />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="form-label mb-0">Content (HTML) *</label>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{wordCount} words · ~{readTime} min read</span>
            </div>
            <textarea
              value={form.content}
              onChange={e => update('content', e.target.value)}
              placeholder={'<h2>Introduction</h2>\n<p>Start writing your article here…</p>\n<blockquote>A memorable quote.</blockquote>'}
              rows={22}
              className="form-input resize-y"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', lineHeight: 1.7 }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Supports: &lt;h2&gt; &lt;h3&gt; &lt;p&gt; &lt;blockquote&gt; &lt;ul&gt; &lt;ol&gt; &lt;li&gt; &lt;code&gt; &lt;pre&gt; &lt;a&gt; &lt;strong&gt; &lt;em&gt;</p>
          </div>

          {/* SEO */}
          <div className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <h3 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>SEO</h3>
            <div>
              <label className="form-label">Meta Description</label>
              <textarea value={form.metaDescription} onChange={e => update('metaDescription', e.target.value)} placeholder="Description for search results (150–160 chars)…" rows={2} className="form-input resize-none text-sm" />
              <p className="text-xs mt-1" style={{ color: form.metaDescription.length > 160 ? '#ef4444' : 'var(--text-muted)' }}>{form.metaDescription.length}/160</p>
            </div>
            {form.title && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Search preview</p>
                <p className="font-medium text-blue-600 dark:text-blue-400 truncate">{form.title}</p>
                <p className="text-xs text-green-700 dark:text-green-500">meridian.blog › blog › {form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 40)}</p>
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{form.metaDescription || form.excerpt || 'No description set.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish */}
          <div className="card p-5">
            <h3 className="font-serif font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Publishing</h3>
            <div className="space-y-3">
              {[
                { label: 'Published', desc: 'Visible to all readers', field: 'published' },
                { label: 'Featured', desc: 'Show in hero section', field: 'featured' },
              ].map(({ label, desc, field }) => (
                <div key={field} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={form[field as keyof typeof form] as boolean} onChange={e => update(field, e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="card p-5">
            <h3 className="font-serif font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Category</h3>
            <div className="space-y-1.5">
              {CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => update('category', cat)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: form.category === cat ? 'var(--accent)' : 'var(--accent-light)',
                    color: form.category === cat ? '#fff' : 'var(--text-secondary)',
                    border: form.category === cat ? 'none' : '1px solid var(--border)',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="card p-5">
            <h3 className="font-serif font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Tags</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag…"
                className="form-input flex-1 text-sm py-1.5"
              />
              <button type="button" onClick={addTag} className="btn-secondary py-1.5 px-3">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map(tag => (
                <span key={tag} className="tag flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">
                    <X size={10} />
                  </button>
                </span>
              ))}
              {form.tags.length === 0 && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Press Enter to add tags</p>}
            </div>
          </div>

          {/* Stats */}
          <div className="card p-5">
            <h3 className="font-serif font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Content</h3>
            {[
              { label: 'Words', value: wordCount.toLocaleString() },
              { label: 'Est. read time', value: `${readTime} min` },
              { label: 'Characters', value: form.content.replace(/<[^>]*>/g, '').length.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>

          {mode === 'edit' && (
            <button
              onClick={() => { if (confirm('Delete this post? This cannot be undone.')) { fetch(`/api/posts/${postId}`, { method: 'DELETE' }).then(() => router.push('/admin/posts')); } }}
              className="btn-danger w-full justify-center"
            >
              Delete Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types';
import { Save, Eye, Star, Upload, AlertCircle, Check } from 'lucide-react';

interface PostEditorProps {
  initial?: Partial<Post>;
  mode: 'create' | 'edit';
  postId?: string;
}

const categories = ['Technology', 'Design', 'Business', 'Science', 'Culture'];

export default function PostEditor({ initial, mode, postId }: PostEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: initial?.title || '',
    excerpt: initial?.excerpt || '',
    content: initial?.content || '',
    coverImage: initial?.coverImage || '',
    category: initial?.category || 'Technology',
    tags: initial?.tags?.join(', ') || '',
    featured: initial?.featured || false,
    published: initial?.published !== false,
    metaDescription: initial?.metaDescription || '',
    metaKeywords: initial?.metaKeywords?.join(', ') || '',
    readTime: initial?.readTime || 5,
  });

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async (publishNow?: boolean) => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.content.trim()) { setError('Content is required'); return; }
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      metaKeywords: form.metaKeywords.split(',').map(t => t.trim()).filter(Boolean),
      published: publishNow !== undefined ? publishNow : form.published,
      readTime: Math.ceil(form.content.split(' ').length / 200) || form.readTime,
    };

    try {
      const url = mode === 'create' ? '/api/posts' : `/api/posts/${postId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (mode === 'create') router.push('/admin/posts');
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const wordCount = form.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const estimatedRead = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {mode === 'create' ? 'New Post' : 'Edit Post'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {wordCount} words · ~{estimatedRead} min read
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {error && (
            <span className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle size={14} /> {error}
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1 text-sm" style={{ color: '#10b981' }}>
              <Check size={14} /> Saved!
            </span>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="btn-secondary"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn-primary"
          >
            <Save size={15} />
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="card p-5">
            <label className="form-label">Post Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="An Intriguing, Click-worthy Title…"
              className="form-input text-lg font-serif"
            />
          </div>

          {/* Excerpt */}
          <div className="card p-5">
            <label className="form-label">Excerpt / Subtitle</label>
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="A compelling one-to-two sentence summary that appears in cards and previews…"
              rows={3}
              className="form-input resize-none"
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{form.excerpt.length}/200 characters</p>
          </div>

          {/* Cover image */}
          <div className="card p-5">
            <label className="form-label">Cover Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={form.coverImage}
                onChange={e => set('coverImage', e.target.value)}
                placeholder="https://images.unsplash.com/photo-…"
                className="form-input"
              />
              <button className="btn-secondary flex-shrink-0">
                <Upload size={14} /> Browse
              </button>
            </div>
            {form.coverImage && (
              <div className="mt-3 rounded-xl overflow-hidden" style={{ height: 160 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="form-label mb-0">Content (HTML) *</label>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>HTML supported</span>
            </div>
            <textarea
              value={form.content}
              onChange={e => set('content', e.target.value)}
              placeholder="<h2>Introduction</h2>&#10;<p>Your article content here…</p>"
              rows={20}
              className="form-input resize-y font-mono text-sm"
              style={{ lineHeight: 1.6 }}
            />
            <div className="flex gap-4 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>{wordCount} words</span>
              <span>~{estimatedRead} min read</span>
              <span>{form.content.length} chars</span>
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-5">
          {/* Status */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Publication</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Published</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Visible to all readers</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                    <Star size={13} style={{ color: '#f59e0b' }} /> Featured
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Highlight on homepage</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button onClick={() => handleSave()} disabled={saving} className="btn-primary w-full justify-center">
                <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
              {form.published && form.title && (
                <a
                  href={`/blog/${form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center"
                >
                  <Eye size={14} /> Preview
                </a>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="card p-5">
            <label className="form-label">Category</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => set('category', cat)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-center transition-all border"
                  style={{
                    background: form.category === cat ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: form.category === cat ? '#fff' : 'var(--text-secondary)',
                    borderColor: form.category === cat ? 'var(--accent)' : 'var(--border)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="card p-5">
            <label className="form-label">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="AI, Design, Technology"
              className="form-input"
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Comma-separated</p>
            {form.tags && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Meta Description</label>
                <textarea
                  value={form.metaDescription}
                  onChange={e => set('metaDescription', e.target.value)}
                  placeholder="Describe this article for search engines…"
                  rows={3}
                  className="form-input resize-none text-sm"
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: form.metaDescription.length > 160 ? '#dc2626' : 'var(--text-muted)' }}>
                  <span>{form.metaDescription.length}/160</span>
                  {form.metaDescription.length > 0 && form.metaDescription.length <= 160 && <span style={{ color: '#10b981' }}>✓ Good length</span>}
                </div>
              </div>
              <div>
                <label className="form-label">Meta Keywords</label>
                <input
                  type="text"
                  value={form.metaKeywords}
                  onChange={e => set('metaKeywords', e.target.value)}
                  placeholder="seo, keywords, comma-separated"
                  className="form-input text-sm"
                />
              </div>
              <div>
                <label className="form-label">Read Time (minutes)</label>
                <input
                  type="number"
                  value={form.readTime}
                  onChange={e => set('readTime', parseInt(e.target.value) || 5)}
                  min={1}
                  max={60}
                  className="form-input"
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Auto-calculated: ~{estimatedRead} min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { Tag, Hash, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface TagData {
  name: string;
  count: number;
  totalViews: number;
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/posts?admin=true')
      .then(r => r.json())
      .then((posts: Post[]) => {
        const tagMap: Record<string, TagData> = {};
        posts.forEach(post => {
          post.tags.forEach(tag => {
            if (!tagMap[tag]) tagMap[tag] = { name: tag, count: 0, totalViews: 0 };
            tagMap[tag].count += 1;
            tagMap[tag].totalViews += post.views;
          });
        });
        setTags(Object.values(tagMap).sort((a, b) => b.count - a.count));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const maxCount = Math.max(...tags.map(t => t.count), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Tags</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {tags.length} unique tags across all posts
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tags…"
          className="form-input max-w-sm"
        />
      </div>

      {/* Tag cloud visual */}
      <div className="card p-6 mb-8">
        <h2 className="font-serif font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Tag Cloud</h2>
        <div className="flex flex-wrap gap-2">
          {filtered.map(tag => (
            <Link
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name.toLowerCase())}`}
              target="_blank"
              className="tag flex items-center gap-1.5 transition-all hover:scale-105"
              style={{
                fontSize: `${0.7 + (tag.count / maxCount) * 0.5}rem`,
                padding: `${0.15 + (tag.count / maxCount) * 0.2}rem ${0.5 + (tag.count / maxCount) * 0.3}rem`,
              }}
            >
              <Hash size={10} />
              {tag.name}
              <span
                className="ml-0.5 font-bold text-xs"
                style={{ color: 'var(--accent)' }}
              >
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse h-10 rounded-lg" style={{ background: 'var(--bg-secondary)' }} />
            ))}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Posts</th>
                <th className="hidden sm:table-cell">Total Views</th>
                <th className="hidden md:table-cell">Avg Views/Post</th>
                <th>Usage</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tag => (
                <tr key={tag.name}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Tag size={14} style={{ color: 'var(--accent)' }} />
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        #{tag.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {tag.count}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {tag.totalViews.toLocaleString()}
                    </span>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {Math.round(tag.totalViews / tag.count).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 rounded-full overflow-hidden flex-1 max-w-20"
                        style={{ background: 'var(--border)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(tag.count / maxCount) * 100}%`,
                            background: 'var(--accent)',
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {Math.round((tag.count / tags.reduce((s, t) => s + t.count, 0)) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <Link
                      href={`/tag/${encodeURIComponent(tag.name.toLowerCase())}`}
                      target="_blank"
                      className="p-1.5 rounded-lg inline-flex transition hover:scale-110"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            No tags found matching &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}

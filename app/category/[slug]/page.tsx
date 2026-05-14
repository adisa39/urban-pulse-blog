'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import AdSpace from '@/components/AdSpace';
import { ApiPost } from '@/lib/hooks';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const COLORS: Record<string, string> = {
  technology: '#3b82f6', design: '#8b5cf6', business: '#10b981',
  culture: '#f59e0b', science: '#14b8a6',
};

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const label = slug.charAt(0).toUpperCase() + slug.slice(1);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/posts?category=${encodeURIComponent(label)}&page=${page}&limit=9`)
      .then(r => r.json())
      .then(data => {
        if (page === 1) setPosts(data.posts || []);
        else setPosts(prev => [...prev, ...(data.posts || [])]);
        setHasMore(data.page < data.pages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, page, label]);

  const color = COLORS[slug] || 'var(--accent)';

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <div className="py-14" style={{ background: `linear-gradient(135deg, ${color}15 0%, var(--bg-primary) 70%)`, borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              <ArrowLeft size={14} /> Back to home
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color }}>Category</p>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{label}</h1>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              {loading ? '…' : `${posts.length} article${posts.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8"><AdSpace variant="leaderboard" /></div>

          {loading && posts.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse rounded-2xl" style={{ background: 'var(--bg-secondary)', height: 320 }} />)}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => (
                  <div key={post.id} className={`animate-fade-in-up delay-${Math.min(i * 100, 300)}`}>
                    <PostCard post={post} variant="default" />
                  </div>
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-10">
                  <button onClick={() => setPage(p => p + 1)} disabled={loading} className="btn-secondary px-8 py-3">
                    {loading ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No articles yet</h2>
              <p className="mb-6" style={{ color: 'var(--text-muted)' }}>No articles in {label} yet. Check back soon.</p>
              <Link href="/" className="btn-primary">Browse all articles</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

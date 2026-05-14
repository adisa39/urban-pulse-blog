'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import AdSpace from '@/components/AdSpace';
import { ApiPost } from '@/lib/hooks';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<ApiPost[]>([]);
  const [query, setQuery] = useState(q);
  const [loading, setLoading] = useState(!!q);

  useEffect(() => {
    if (!q) { setResults([]); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/posts?search=${encodeURIComponent(q)}&limit=30`)
      .then(r => r.json())
      .then(data => { setResults(data.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  };

  return (
    <main className="pt-16">
      <div className="hero-gradient py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            {q ? `Results for "${q}"` : 'Search Articles'}
          </h1>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search articles, topics, authors…"
                className="form-input pl-11 py-3 text-base w-full"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary px-6">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8"><AdSpace variant="leaderboard" /></div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse rounded-2xl" style={{ background: 'var(--bg-secondary)', height: 320 }} />)}
          </div>
        ) : q ? (
          <>
            <div className="mb-6 pb-4" style={{ borderBottom: '2px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {results.length === 0 ? 'No results' : `${results.length} article${results.length === 1 ? '' : 's'} found`}
              </p>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(post => <PostCard key={post.id} post={post} variant="default" />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-light)' }}>
                  <Search size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No articles found</h2>
                <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Try different keywords or browse by category.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Technology', 'Design', 'Business', 'Science', 'Culture'].map(cat => (
                    <Link key={cat} href={`/category/${cat.toLowerCase()}`} className="tag">{cat}</Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="font-serif text-xl mb-8" style={{ color: 'var(--text-primary)' }}>Browse by category</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Technology', 'Design', 'Business', 'Science', 'Culture'].map(cat => (
                <Link key={cat} href={`/category/${cat.toLowerCase()}`} className="btn-secondary">{cat}</Link>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && <div className="mt-12"><AdSpace variant="rectangle" /></div>}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-16 min-h-screen" />}>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}

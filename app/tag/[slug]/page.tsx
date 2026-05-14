'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import AdSpace from '@/components/AdSpace';
import { ApiPost } from '@/lib/hooks';
import { Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TagPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const tag = decodeURIComponent(slug);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/posts?tag=${encodeURIComponent(tag)}&limit=30`).then(r => r.json()),
      fetch('/api/tags').then(r => r.json()),
    ]).then(([postsData, tagsData]) => {
      setPosts(postsData.posts || []);
      setAllTags((tagsData as { name: string }[]).map(t => t.name));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [tag]);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="hero-gradient py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              <ArrowLeft size={14} /> Back to home
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                <Tag size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Tag</p>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3 capitalize" style={{ color: 'var(--text-primary)' }}>#{tag}</h1>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              {loading ? '…' : `${posts.length} article${posts.length !== 1 ? 's' : ''} tagged with "${tag}"`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8"><AdSpace variant="leaderboard" /></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse rounded-2xl" style={{ background: 'var(--bg-secondary)', height: 320 }} />)}
                </div>
              ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {posts.map(post => <PostCard key={post.id} post={post} variant="default" />)}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Tag size={28} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
                  <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No articles yet</h2>
                  <p className="mb-6" style={{ color: 'var(--text-muted)' }}>No articles tagged &quot;{tag}&quot; yet.</p>
                  <Link href="/" className="btn-primary">Browse all articles</Link>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="card p-5">
                <h3 className="font-serif font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>All Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(t => (
                    <Link key={t} href={`/tag/${encodeURIComponent(t.toLowerCase())}`} className="tag"
                      style={t.toLowerCase() === tag.toLowerCase() ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' } : {}}>
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
              <AdSpace variant="rectangle" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

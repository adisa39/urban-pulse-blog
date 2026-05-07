'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import AdSpace from '@/components/AdSpace';
import { Post } from '@/types';
import { Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TagPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const tag = decodeURIComponent(slug);
  const [posts, setPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then((data: Post[]) => {
        const tagged = data.filter(p =>
          p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        setPosts(tagged);
        const tags = [...new Set(data.flatMap(p => p.tags))];
        setAllTags(tags);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tag]);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <div className="hero-gradient py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm mb-6"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={14} /> Back to home
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent-light)' }}
              >
                <Tag size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Tag
              </p>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3 capitalize" style={{ color: 'var(--text-primary)' }}>
              #{tag}
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              {loading ? '…' : `${posts.length} article${posts.length === 1 ? '' : 's'} tagged with "${tag}"`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Top ad */}
          <div className="mb-8">
            <AdSpace variant="leaderboard" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Posts */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl" style={{ background: 'var(--bg-secondary)', height: 320 }} />
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {posts.map((post, i) => (
                    <div key={post.id} className={`animate-fade-in-up delay-${Math.min(i * 100, 400)}`}>
                      <PostCard post={post} variant="default" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'var(--accent-light)' }}
                  >
                    <Tag size={28} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    No articles yet
                  </h2>
                  <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                    No articles have been tagged with &quot;{tag}&quot; yet.
                  </p>
                  <Link href="/" className="btn-primary">Browse all articles</Link>
                </div>
              )}
            </div>

            {/* Tag cloud sidebar */}
            <div className="space-y-6">
              <div className="card p-5">
                <h3 className="font-serif font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                  All Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(t => (
                    <Link
                      key={t}
                      href={`/tag/${encodeURIComponent(t.toLowerCase())}`}
                      className="tag"
                      style={{
                        background: t.toLowerCase() === tag.toLowerCase() ? 'var(--accent)' : undefined,
                        color: t.toLowerCase() === tag.toLowerCase() ? '#fff' : undefined,
                        borderColor: t.toLowerCase() === tag.toLowerCase() ? 'var(--accent)' : undefined,
                      }}
                    >
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

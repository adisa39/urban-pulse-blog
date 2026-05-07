'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import AdSpace from '@/components/AdSpace';
import { Post } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const categoryColors: Record<string, string> = {
  technology: '#3b82f6',
  design: '#8b5cf6',
  business: '#10b981',
  culture: '#f59e0b',
  science: '#14b8a6',
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const color = categoryColors[slug] || 'var(--accent)';

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then((all: Post[]) => {
        setPosts(all.filter(p => p.category.toLowerCase() === slug.toLowerCase()));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Category hero */}
        <div className="py-14 text-center" style={{ background: `linear-gradient(135deg, ${color}15 0%, var(--bg-primary) 70%)`, borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-2xl mx-auto px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: `${color}20` }}>
              <div className="w-4 h-4 rounded-full" style={{ background: color }} />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{categoryName}</h1>
            <p className="text-base" style={{ color: 'var(--text-muted)' }}>
              {posts.length} article{posts.length !== 1 ? 's' : ''} in this topic
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <AdSpace variant="leaderboard" />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl" style={{ background: 'var(--bg-secondary)', height: 300 }} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: 'var(--text-muted)' }}>No articles found in {categoryName}.</p>
              <Link href="/" className="btn-primary mt-4 inline-flex">Browse All Articles</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {posts.map((post, i) => (
                <div key={post.id} className={`animate-fade-in-up delay-${Math.min(i * 100, 400)}`}>
                  <PostCard post={post} variant={i === 0 ? 'featured' : 'default'} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

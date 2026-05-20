'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import AdSpace from '@/components/AdSpace';
import Sidebar from '@/components/Sidebar';
import { ApiPost } from '@/lib/hooks';
import { TrendingUp, Clock, Star } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'latest' | 'popular' | 'featured'>('latest');

  useEffect(() => {
    fetch('/api/posts?limit=50')
      .then(r => r.json())
      .then(data => { setPosts(data.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const hero = posts.find(p => p.featured) || posts[0];
  const featuredPosts = posts.filter(p => p.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 9);
  const popularPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 9);

  const tabPosts = tab === 'latest' ? latestPosts : tab === 'popular' ? popularPosts : featuredPosts;

  const Skeleton = () => (
    <div className="animate-pulse rounded-2xl" style={{ background: 'var(--bg-secondary)', height: 320 }} />
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toCardPost = (p: ApiPost): any => ({
    ...p,
    tags: p.tags.map(t => t.name),
    author: {
      ...p.author,
      avatar: '/logo.png', //  p.author.avatar || 
      bio: p.author.bio || '',
      id: p.author.id,
      social: {
        twitter: p.author.twitterHandle || undefined,
        linkedin: p.author.linkedinUrl || undefined,
        github: p.author.githubUrl || undefined,
      },
    },
    readTime: p.readTime,
  });

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <div className="hero-gradient py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="animate-pulse rounded-2xl" style={{ background: 'var(--bg-secondary)', height: 480 }} />
            ) : hero ? (
              <PostCard post={toCardPost(hero) as Parameters<typeof PostCard>[0]['post']} variant="hero" />
            ) : null}
          </div>
        </div>

        {/* Top leaderboard ad */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdSpace variant="leaderboard" />
        </div>

        {/* Featured grid */}
        {!loading && featuredPosts.length > 1 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="flex items-center gap-3 mb-6">
              <Star size={18} style={{ color: 'var(--accent)' }} />
              <h2 className="font-serif text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Featured</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map(p => (
                <PostCard key={p.id} post={toCardPost(p) as Parameters<typeof PostCard>[0]['post']} variant="featured" />
              ))}
            </div>
          </section>
        )}

        {/* Mid-page rectangle ad */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex justify-center">
            <div className="w-full max-w-sm"><AdSpace variant="rectangle" label="300 × 250 · Mid-page Ad" /></div>
          </div>
        </div>

        {/* Posts feed + sidebar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Posts */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="flex items-center gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                {([
                  { key: 'latest', label: 'Latest', icon: Clock },
                  { key: 'popular', label: 'Popular', icon: TrendingUp },
                  { key: 'featured', label: 'Featured', icon: Star },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: tab === key ? 'var(--accent)' : 'transparent',
                      color: tab === key ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
                </div>
              ) : tabPosts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-serif text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No posts yet</p>
                  <p style={{ color: 'var(--text-muted)' }}>Check back soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {tabPosts.map((p, i) => (
                    <div key={p.id} className={`animate-fade-in-up delay-${Math.min(i * 100, 300)}`}>
                      <PostCard post={toCardPost(p) as Parameters<typeof PostCard>[0]['post']} variant="default" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <Sidebar
                popularPosts={[...posts].sort((a, b) => b.views - a.views).slice(0, 5).map(toCardPost)}
                allTags={[...new Set(posts.flatMap(p => p.tags.map(t => t.name)))]}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

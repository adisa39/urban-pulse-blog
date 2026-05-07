'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import AdSpace from '@/components/AdSpace';
import { Post } from '@/types';
import { Flame, Clock, Star } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'latest' | 'popular' | 'featured'>('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const heroPost = posts[0];
  const featuredGrid = posts.slice(1, 4);
  const popularPosts = [...posts].sort((a, b) => b.views - a.views);
  const allTags = [...new Set(posts.flatMap(p => p.tags))].slice(0, 20);

  const tabPosts = {
    latest: posts.slice(4),
    popular: popularPosts.slice(4),
    featured: posts.filter(p => p.featured).slice(1),
  };

  const tabs = [
    { key: 'latest', label: 'Latest', icon: <Clock size={14} /> },
    { key: 'popular', label: 'Popular', icon: <Flame size={14} /> },
    { key: 'featured', label: 'Featured', icon: <Star size={14} /> },
  ] as const;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero leaderboard ad */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <AdSpace variant="leaderboard" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero section */}
          {loading ? (
            <div className="animate-pulse rounded-2xl" style={{ background: 'var(--bg-secondary)', height: 480 }} />
          ) : heroPost ? (
            <div className="mb-10 animate-fade-in-up">
              <PostCard post={heroPost} variant="hero" />
            </div>
          ) : null}

          {/* Featured grid below hero */}
          {featuredGrid.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {featuredGrid.map((post, i) => (
                <div key={post.id} className={`animate-fade-in-up delay-${(i + 1) * 100}`}>
                  <PostCard post={post} variant="featured" />
                </div>
              ))}
            </div>
          )}

          {/* Mid-page leaderboard ad */}
          <AdSpace variant="leaderboard" label="728 × 90 — Mid-Page Ad" />

          {/* Main content + sidebar */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Article feed */}
            <div className="lg:col-span-2">
              {/* Tab navigation */}
              <div className="flex items-center gap-1 mb-6 pb-4" style={{ borderBottom: '2px solid var(--border)' }}>
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: activeTab === tab.key ? 'var(--accent)' : 'transparent',
                      color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl" style={{ background: 'var(--bg-secondary)', height: 160 }} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {tabPosts[activeTab].map((post, i) => (
                    <div key={post.id} className={`animate-fade-in-up delay-${Math.min(i * 100, 400)}`}>
                      <PostCard post={post} variant="default" />
                    </div>
                  ))}
                  {tabPosts[activeTab].length === 0 && (
                    <p className="col-span-2 text-center py-12" style={{ color: 'var(--text-muted)' }}>No posts in this category yet.</p>
                  )}
                </div>
              )}

              {/* In-feed ad */}
              <div className="mt-8">
                <AdSpace variant="rectangle" label="300 × 250 — In-Feed Ad" />
              </div>
            </div>

            {/* Sidebar */}
            {!loading && (
              <Sidebar popularPosts={popularPosts} allTags={allTags} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShareButtons from '@/components/ShareButtons';
import AdSpace from '@/components/AdSpace';
import ReadingProgress from '@/components/ReadingProgress';
import PostCard from '@/components/PostCard';
import { Post } from '@/types';
import { Clock, Eye, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    fetch('/api/posts')
      .then(r => r.json())
      .then((all: Post[]) => {
        const found = all.find(p => p.slug === slug);
        setPost(found || null);
        if (found) {
          const related = all
            .filter(p => p.id !== found.id && (p.category === found.category || p.tags.some(t => found.tags.includes(t))))
            .slice(0, 3);
          setRelatedPosts(related);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading article…</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Article not found</h1>
            <Link href="/" className="btn-primary">← Back to Home</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ReadingProgress />
      <Navbar />
      <main className="pt-16">
        {/* Top leaderboard ad */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2">
          <AdSpace variant="leaderboard" />
        </div>

        {/* Back link */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
          >
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Article header */}
          <header className="mb-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link href={`/category/${post.category.toLowerCase()}`} className="category-badge">{post.category}</Link>
              {post.featured && (
                <span className="category-badge" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'transparent' }}>Featured</span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5" style={{ color: 'var(--text-primary)' }}>
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={44}
                  height={44}
                  className="rounded-full object-cover border-2"
                  style={{ borderColor: 'var(--border)' }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{post.author.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.author.bio.slice(0, 50)}…</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm flex-wrap" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><Calendar size={13} /> {format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime} min read</span>
                <span className="flex items-center gap-1"><Eye size={13} /> {post.views.toLocaleString()} views</span>
              </div>
            </div>
          </header>

          {/* Cover image */}
          <div className="relative overflow-hidden rounded-2xl mb-8 animate-fade-in-up delay-100" style={{ height: 400 }}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Two-column layout: article + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Article content */}
            <div className="lg:col-span-3">
              <div
                className="prose-content animate-fade-in-up delay-200"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-8 pt-6 flex flex-wrap gap-2" style={{ borderTop: '1px solid var(--border)' }}>
                <Tag size={15} style={{ color: 'var(--text-muted)' }} className="mt-0.5" />
                {post.tags.map(tag => (
                  <Link key={tag} href={`/tag/${encodeURIComponent(tag.toLowerCase())}`} className="tag">
                    {tag}
                  </Link>
                ))}
              </div>

              {/* Share buttons */}
              <div className="mt-8 p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <ShareButtons url={url} title={post.title} excerpt={post.excerpt} />
              </div>

              {/* Author bio */}
              <div className="mt-8 p-6 rounded-2xl flex flex-col sm:flex-row gap-5" style={{ border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>About the Author</p>
                  <h4 className="font-serif text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{post.author.name}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{post.author.bio}</p>
                  {post.author.social && (
                    <div className="flex items-center gap-3 mt-3">
                      {post.author.social.twitter && (
                        <a href={`https://twitter.com/${post.author.social.twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                          @{post.author.social.twitter}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-20">
                <AdSpace variant="rectangle" />
                <div className="mt-6">
                  <ShareButtons url={url} title={post.title} />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Mid-article ad */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <AdSpace variant="leaderboard" label="728 × 90 — Post-Article Ad" />
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(p => (
                <PostCard key={p.id} post={p} variant="featured" />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

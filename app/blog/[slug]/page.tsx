'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShareButtons from '@/components/ShareButtons';
import PostCard from '@/components/PostCard';
import AdSpace from '@/components/AdSpace';
import ReadingProgress from '@/components/ReadingProgress';
import { ApiPost } from '@/lib/hooks';
import { Clock, Eye, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/SocialIcons';
import { format, formatDistanceToNow } from 'date-fns';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<ApiPost | null>(null);
  const [related, setRelated] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postUrl, setPostUrl] = useState('');

  useEffect(() => {
    setPostUrl(window.location.href);
    const load = async () => {
      try {
        const [postRes, allRes] = await Promise.all([
          fetch(`/api/posts/${slug}`),
          fetch(`/api/posts?limit=50`),
        ]);
        if (!postRes.ok) { setLoading(false); return; }
        const postData: ApiPost = await postRes.json();
        setPost(postData);
        // increment view count (fire and forget)
        fetch(`/api/views/${slug}`, { method: 'POST' }).catch(() => {});
        // related posts
        if (allRes.ok) {
          const allData = await allRes.json();
          const rel = (allData.posts as ApiPost[])
            .filter(p => p.id !== postData.id && p.category === postData.category)
            .slice(0, 3);
          setRelated(rel);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return (
    <>
      <Navbar />
      <main className="pt-16 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 rounded-xl w-2/3" style={{ background: 'var(--bg-secondary)' }} />
          <div className="h-80 rounded-2xl" style={{ background: 'var(--bg-secondary)' }} />
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 rounded" style={{ background: 'var(--bg-secondary)', width: `${75 + Math.random() * 25}%` }} />)}
        </div>
      </main>
      <Footer />
    </>
  );

  if (!post) return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-7xl font-serif font-bold mb-4" style={{ color: 'var(--border)' }}>404</p>
        <h1 className="text-2xl font-serif font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Post Not Found</h1>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>This article doesn&apos;t exist or was removed.</p>
        <Link href="/" className="btn-primary">← Back to Home</Link>
      </main>
      <Footer />
    </>
  );

  const avatar = post.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';

  return (
    <>
      <ReadingProgress />
      <Navbar />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <AdSpace variant="leaderboard" />
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link>
            <span>/</span>
            <Link href={`/category/${post.category.toLowerCase()}`} className="hover:underline" style={{ color: 'var(--accent)' }}>{post.category}</Link>
            <span>/</span>
            <span className="truncate max-w-xs">{post.title}</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Link href={`/category/${post.category.toLowerCase()}`}><span className="category-badge">{post.category}</span></Link>
            {post.featured && <span className="category-badge" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'transparent' }}>Featured</span>}
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><Clock size={13} /> {post.readTime} min read</span>
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><Eye size={13} /> {post.views.toLocaleString()} views</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 animate-fade-in-up" style={{ color: 'var(--text-primary)' }}>
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{post.excerpt}</p>

          {/* Author row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between pb-6 mb-8" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <Image src={avatar} alt={post.author.name} width={48} height={48} className="rounded-full object-cover border-2" style={{ borderColor: 'var(--border)' }} />
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{post.author.name}</p>
                <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
                  <span className="text-xs opacity-60">({formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })})</span>
                </div>
              </div>
            </div>
            <ShareButtons url={postUrl} title={post.title} excerpt={post.excerpt || ''} compact />
          </div>

          {/* Cover image */}
          <div className="relative overflow-hidden rounded-2xl mb-10 shadow-lg animate-fade-in-up" style={{ height: 400 }}>
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>

          {/* Content + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3">
              <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* Tags */}
              <div className="mt-10 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={15} style={{ color: 'var(--accent)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(t => (
                    <Link key={t.id} href={`/tag/${encodeURIComponent(t.name.toLowerCase())}`} className="tag">#{t.name}</Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <ShareButtons url={postUrl} title={post.title} excerpt={post.excerpt || ''} />
              </div>

              {/* In-article ad */}
              <div className="mt-8"><AdSpace variant="rectangle" label="300 × 250 — In-Article Ad" /></div>

              {/* Author bio */}
              <div className="mt-8 p-6 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Image src={avatar} alt={post.author.name} width={72} height={72} className="rounded-full object-cover flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Written by</p>
                    <h3 className="font-serif font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>{post.author.name}</h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{post.author.bio || ''}</p>
                    <div className="flex items-center gap-2">
                      {post.author.twitterHandle && (
                        <a href={`https://twitter.com/${post.author.twitterHandle}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:scale-110" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                          <TwitterIcon size={14} />
                        </a>
                      )}
                      {post.author.linkedinUrl && (
                        <a href={post.author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:scale-110" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                          <LinkedinIcon size={14} />
                        </a>
                      )}
                      {post.author.githubUrl && (
                        <a href={post.author.githubUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:scale-110" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                          <GithubIcon size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky sidebar ad */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <AdSpace variant="skyscraper" />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/" className="btn-secondary inline-flex items-center gap-2"><ArrowLeft size={15} /> Back to all articles</Link>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="pb-4 mb-8" style={{ borderBottom: '2px solid var(--border)' }}>
              <h2 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>More from {post.category}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(rp => <PostCard key={rp.id} post={rp} variant="featured" />)}
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <AdSpace variant="leaderboard" label="728 × 90 — Footer Ad" />
        </div>
      </main>
      <Footer />
    </>
  );
}

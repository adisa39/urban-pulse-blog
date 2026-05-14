'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ApiPost } from '@/lib/hooks';
import { Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Accepts either ApiPost (tags as objects) or a plain post with tags as strings
interface FlatPost extends Omit<ApiPost, 'tags' | 'author'> {
  tags: string[] | { id: string; name: string }[];
  author: {
    id: string;
    name: string;
    avatar: string | null;
    bio?: string | null;
    twitterHandle?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
  };
}

interface PostCardProps {
  post: FlatPost;
  variant?: 'default' | 'featured' | 'compact' | 'hero';
}

function tagName(t: string | { id: string; name: string }): string {
  return typeof t === 'string' ? t : t.name;
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });
  const avatar = post.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';

  if (variant === 'hero') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block relative overflow-hidden rounded-2xl" style={{ minHeight: 480 }}>
        <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="category-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>{post.category}</span>
            {post.featured && <span className="category-badge" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'transparent' }}>Featured</span>}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight group-hover:underline">{post.title}</h2>
          <p className="text-white/75 text-sm sm:text-base line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src={avatar} alt={post.author.name} width={28} height={28} className="rounded-full object-cover border-2 border-white/40" />
              <span className="text-white/85 text-sm font-medium">{post.author.name}</span>
            </div>
            <span className="text-white/50 text-sm flex items-center gap-1"><Clock size={13} /> {post.readTime} min read</span>
            <span className="text-white/50 text-sm hidden sm:flex items-center gap-1"><Eye size={13} /> {post.views.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className="card group block overflow-hidden">
        <div className="relative overflow-hidden" style={{ height: 220 }}>
          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-3 left-3">
            <span className="category-badge" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>{post.category}</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-serif text-lg font-bold mb-2 leading-snug group-hover:underline line-clamp-2" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
          <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src={avatar} alt={post.author.name} width={24} height={24} className="rounded-full object-cover" />
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{post.author.name}</span>
            </div>
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Clock size={12} /> {post.readTime}m</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative flex-shrink-0 overflow-hidden rounded-lg" style={{ width: 72, height: 72 }}>
          <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{post.category}</span>
          <h4 className="font-serif font-semibold text-sm leading-snug mt-0.5 line-clamp-2 group-hover:underline" style={{ color: 'var(--text-primary)' }}>{post.title}</h4>
          <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>{timeAgo}</span>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/blog/${post.slug}`} className="card group block overflow-hidden">
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3">
          <span className="category-badge" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>{post.category}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-bold mb-2 leading-snug line-clamp-2 group-hover:underline" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
        <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map(t => (
            <span key={tagName(t)} className="tag">{tagName(t)}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <Image src={avatar} alt={post.author.name} width={26} height={26} className="rounded-full object-cover" />
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{post.author.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}m</span>
            <span className="hidden sm:flex items-center gap-1"><Eye size={12} /> {post.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

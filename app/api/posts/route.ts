import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost, getStats } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get('admin') === 'true';
  const stats = searchParams.get('stats') === 'true';

  if (stats) {
    return NextResponse.json(getStats());
  }

  const posts = getPosts(!admin);
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authors } = await import('@/lib/store');

    const post = createPost({
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content || '',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=630&fit=crop',
      category: body.category || 'Technology',
      tags: body.tags || [],
      author: authors[0],
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: Math.ceil((body.content || '').split(' ').length / 200) || 5,
      featured: body.featured || false,
      published: body.published !== false,
      metaDescription: body.metaDescription || body.excerpt || '',
      metaKeywords: body.tags || [],
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

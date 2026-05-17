import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin, slugify, estimateReadTime } from '@/lib/api';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';
    const stats = searchParams.get('stats') === 'true';
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    if (stats) {
      const session = await getSession();
      if (!session) return err('Unauthorized', 401);
      const [total, published, drafts, featuredCount, totalViews] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { published: true } }),
        prisma.post.count({ where: { published: false } }),
        prisma.post.count({ where: { featured: true } }),
        prisma.post.aggregate({ _sum: { views: true } }),
      ]);
      return ok({ totalPosts: total, publishedPosts: published, draftPosts: drafts, featuredPosts: featuredCount, totalViews: totalViews._sum.views || 0, categories: 5 });
    }

    const where: Record<string, unknown> = {};
    if (!admin) where.published = true;
    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (featured) where.featured = true;
    if (tag) where.tags = { some: { name: { equals: tag, mode: 'insensitive' } } };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { author: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true, bio: true, twitterHandle: true, linkedinUrl: true, githubUrl: true } },
          tags: { select: { id: true, name: true } },
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.post.count({ where }),
    ]);

    return ok({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error('GET /api/posts error:', e);
    return err('Server error', 500);
  }
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await request.json();
    const { title, excerpt, content, coverImage, coverImagePath = '', category, tags = [], published, featured, metaDescription } = body;

    if (!title?.trim()) return err('Title is required');
    if (!content?.trim()) return err('Content is required');
    if (!category) return err('Category is required');

    let slug = slugify(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = slug + '-' + Date.now();

    const tagRecords = await Promise.all(
      tags.map((name: string) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
      )
    );

    const post = await prisma.post.create({
      data: {
        slug,
        title: title.trim(),
        excerpt: excerpt?.trim() || '',
        content: content.trim(),
        coverImage: coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=630&fit=crop',
        coverImagePath: coverImagePath || '',
        category,
        published: published ?? false,
        featured: featured ?? false,
        readTime: estimateReadTime(content),
        metaDescription: metaDescription?.trim() || excerpt?.trim() || '',
        authorId: user!.id,
        tags: { connect: tagRecords.map(t => ({ id: t.id })) },
      },
      include: {
        author: { select: { id: true, name: true, avatar: true, bio: true } },
        tags: true,
      },
    });

    return ok(post, 201);
  } catch (e) {
    console.error('POST /api/posts error:', e);
    return err('Server error', 500);
  }
}

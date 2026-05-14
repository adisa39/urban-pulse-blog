import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin, slugify, estimateReadTime } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

const postInclude = {
  author: { select: { id: true, name: true, avatar: true, bio: true, twitterHandle: true, linkedinUrl: true, githubUrl: true } },
  tags: { select: { id: true, name: true } },
};

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const post = await prisma.post.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: postInclude,
    });
    if (!post) return err('Post not found', 404);
    return ok(post);
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await request.json();
    const { title, excerpt, content, coverImage, category, tags, published, featured, metaDescription } = body;

    // Handle tag updates
    let tagConnect: { id: string }[] | undefined;
    if (Array.isArray(tags)) {
      const tagRecords = await Promise.all(
        tags.map((name: string) =>
          prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
        )
      );
      tagConnect = tagRecords.map(t => ({ id: t.id }));
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) { data.title = title; data.slug = slugify(title); }
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (content !== undefined) { data.content = content; data.readTime = estimateReadTime(content); }
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (category !== undefined) data.category = category;
    if (published !== undefined) data.published = published;
    if (featured !== undefined) data.featured = featured;
    if (metaDescription !== undefined) data.metaDescription = metaDescription;

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        ...(tagConnect ? { tags: { set: [], connect: tagConnect } } : {}),
      },
      include: postInclude,
    });

    return ok(post);
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = await request.json();
    const post = await prisma.post.update({ where: { id }, data: body, include: postInclude });
    return ok(post);
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await prisma.post.delete({ where: { id } });
    return ok({ success: true });
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}

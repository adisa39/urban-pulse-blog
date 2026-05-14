import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api';

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;
  try {
    await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
    return ok({ success: true });
  } catch {
    return err('Not found', 404);
  }
}

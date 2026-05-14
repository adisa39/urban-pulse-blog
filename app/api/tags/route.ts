import { ok, err } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { posts: { _count: 'desc' } },
    });
    return ok(tags);
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}

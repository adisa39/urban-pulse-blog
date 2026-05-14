import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
    return ok(map);
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}

export async function PUT(request: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body: Record<string, string> = await request.json();
    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    );
    return ok({ success: true });
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}

import { NextResponse } from 'next/server';
import { getSession } from './auth';

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAdmin() {
  const user = await getSession();
  if (!user) return { user: null, response: err('Unauthorized', 401) };
  if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
    return { user: null, response: err('Forbidden', 403) };
  }
  return { user, response: null };
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

export function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

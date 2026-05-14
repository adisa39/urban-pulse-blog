import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSessionToken, COOKIE_NAME, EXPIRES_IN } from '@/lib/auth';
import { err } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return err('Email and password are required');
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return err('Invalid credentials', 401);

    const valid = await verifyPassword(password, user.password);
    if (!valid) return err('Invalid credentials', 401);

    const token = await createSessionToken(user.id);

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: EXPIRES_IN,
      path: '/',
    });

    return response;
  } catch (e) {
    console.error('Login error:', e);
    return err('Server error', 500);
  }
}

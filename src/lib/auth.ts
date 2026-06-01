import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('allshop_session');
  if (!session) return null;
  return session.value;
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
  };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

export async function ensureUser(): Promise<{ userId: string; isNew: boolean }> {
  const sessionId = await getSessionUserId();
  if (sessionId) {
    const user = await db.user.findUnique({ where: { id: sessionId } });
    if (user) return { userId: user.id, isNew: false };
  }
  // Create guest user
  const guest = await db.user.create({
    data: {
      email: `guest_${Date.now()}@allshop.guest`,
      name: 'Guest',
      password: 'guest',
      role: 'customer',
    },
  });
  return { userId: guest.id, isNew: true };
}

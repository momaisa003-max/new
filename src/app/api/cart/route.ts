import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser } from '@/lib/auth';

function parseCartItem(item: Record<string, unknown>) {
  return {
    ...item,
    product: item.product
      ? {
          ...item.product,
          images: typeof (item.product as Record<string, unknown>).images === 'string'
            ? JSON.parse((item.product as Record<string, unknown>).images as string)
            : (item.product as Record<string, unknown>).images,
          tags: typeof (item.product as Record<string, unknown>).tags === 'string'
            ? JSON.parse((item.product as Record<string, unknown>).tags as string)
            : (item.product as Record<string, unknown>).tags,
        }
      : item.product,
  };
}

export async function GET() {
  try {
    const { userId, isNew } = await ensureUser();

    const response = NextResponse.json({ userId });

    if (isNew) {
      response.cookies.set('allshop_session', userId, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // Get or create cart
    let cart = await db.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    const parsedItems = cart.items.map(parseCartItem);

    return NextResponse.json({
      cartId: cart.id,
      items: parsedItems,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

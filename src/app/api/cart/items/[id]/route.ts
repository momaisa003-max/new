import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { quantity } = await request.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    const cartItem = await db.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Check stock
    const product = await db.product.findUnique({ where: { id: cartItem.productId } });
    if (product && product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    await db.cartItem.update({
      where: { id },
      data: { quantity },
    });

    // Return updated cart items
    const cart = await db.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      cartId: cart?.id,
      items: cart?.items.map(parseCartItem) || [],
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const cartItem = await db.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    await db.cartItem.delete({ where: { id } });

    // Return updated cart items
    const cart = await db.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      cartId: cart?.id,
      items: cart?.items.map(parseCartItem) || [],
    });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

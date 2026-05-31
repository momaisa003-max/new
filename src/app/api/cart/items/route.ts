import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const { userId, isNew } = await ensureUser();

    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'ProductId and valid quantity are required' },
        { status: 400 }
      );
    }

    // Check product exists and is in stock
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product || !product.active) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await db.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await db.cart.create({ data: { userId } });
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Return updated cart
    const updatedCart = await db.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const response = NextResponse.json({
      cartId: cart.id,
      items: updatedCart?.items.map(parseCartItem) || [],
    });

    if (isNew) {
      response.cookies.set('allshop_session', userId, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    console.error('Add cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

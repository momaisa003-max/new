import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shippingAddress, paymentMethod } = await request.json();

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Get user's cart
    const cart = await db.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    // Create order
    const order = await db.order.create({
      data: {
        userId,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: paymentMethod || 'card',
        paymentStatus: 'paid', // Simulate successful payment
        status: 'pending',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock
    for (const item of cart.items) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear cart
    await db.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Parse JSON fields in response
    const parsedOrder = {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress),
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          images: typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images,
          tags: typeof item.product.tags === 'string' ? JSON.parse(item.product.tags) : item.product.tags,
        },
      })),
    };

    return NextResponse.json({ order: parsedOrder, success: true });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUserId, isAdmin } from '@/lib/auth';

function parseOrder(order: Record<string, unknown>) {
  return {
    ...order,
    shippingAddress:
      typeof order.shippingAddress === 'string'
        ? JSON.parse(order.shippingAddress)
        : order.shippingAddress,
    items: Array.isArray(order.items)
      ? order.items.map((item: Record<string, unknown>) => ({
          ...item,
          product: item.product
            ? {
                ...(item.product as Record<string, unknown>),
                images:
                  typeof (item.product as Record<string, unknown>).images === 'string'
                    ? JSON.parse((item.product as Record<string, unknown>).images as string)
                    : (item.product as Record<string, unknown>).images,
                tags:
                  typeof (item.product as Record<string, unknown>).tags === 'string'
                    ? JSON.parse((item.product as Record<string, unknown>).tags as string)
                    : (item.product as Record<string, unknown>).tags,
              }
            : item.product,
        }))
      : order.items,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getSessionUserId();
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Allow owner or admin to view
    const admin = await isAdmin();
    if (order.userId !== userId && !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(parseOrder(order));
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await db.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus;

    const order = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(parseOrder(order));
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

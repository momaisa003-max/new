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

export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ orders: [] });
    }

    const { searchParams } = new URL(request.url);
    const adminMode = searchParams.get('admin') === 'true';

    const adminFlag = await isAdmin();
    const whereClause = adminMode && adminFlag ? {} : { userId };

    const includeClause: Record<string, unknown> = {
      items: {
        include: {
          product: true,
        },
      },
    };

    if (adminMode && adminFlag) {
      includeClause.user = {
        select: { id: true, name: true, email: true },
      };
    }

    const orders = await db.order.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: { createdAt: 'desc' },
    });

    const parsedOrders = orders.map(parseOrder);

    return NextResponse.json({ orders: parsedOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

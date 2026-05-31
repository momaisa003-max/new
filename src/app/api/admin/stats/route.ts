import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Total revenue from paid orders
    const paidOrders = await db.order.findMany({
      where: { paymentStatus: 'paid' },
      select: { total: true },
    });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    // Total orders
    const totalOrders = await db.order.count();

    // Total products (active)
    const totalProducts = await db.product.count({ where: { active: true } });

    // Total users
    const totalUsers = await db.user.count();

    // Recent orders (last 10)
    const recentOrders = await db.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const parsedRecentOrders = recentOrders.map((order) => ({
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress),
    }));

    // Monthly sales for last 6 months
    const now = new Date();
    const monthlySales = [];
    for (let i = 5; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const monthOrders = await db.order.findMany({
        where: {
          paymentStatus: 'paid',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        select: { total: true },
      });

      const monthTotal = monthOrders.reduce((sum, o) => sum + o.total, 0);
      monthlySales.push({
        month: startOfMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: Math.round(monthTotal * 100) / 100,
        orders: monthOrders.length,
      });
    }

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders: parsedRecentOrders,
      monthlySales,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

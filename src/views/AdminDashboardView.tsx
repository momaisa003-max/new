'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { OrderType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: OrderType[];
  monthlySales: { month: string; revenue: number; orders: number }[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboardView() {
  const navigate = useAppStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate({ page: 'home' });
      return;
    }
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin()) return null;

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      change: '+12.5%',
      up: true,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Total Orders',
      value: (stats?.totalOrders || 0).toLocaleString(),
      icon: ShoppingBag,
      change: '+8.2%',
      up: true,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Products',
      value: (stats?.totalProducts || 0).toLocaleString(),
      icon: Package,
      change: '+3.1%',
      up: true,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Users',
      value: (stats?.totalUsers || 0).toLocaleString(),
      icon: Users,
      change: '+5.4%',
      up: true,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your store performance
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate({ page: 'admin-products' })}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Manage Products
          </button>
          <button
            onClick={() => navigate({ page: 'admin-orders' })}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium ml-4"
          >
            Manage Orders
          </button>
          <button
            onClick={() => navigate({ page: 'admin-messages' })}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium ml-4"
          >
            Messages
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <Card key={i} className="py-0 gap-0">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="py-0 gap-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{stat.title}</span>
                      <div className={`size-8 rounded-md flex items-center justify-center ${stat.color}`}>
                        <Icon className="size-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center mt-1 text-xs">
                      {stat.up ? (
                        <ArrowUpRight className="size-3 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="size-3 text-red-600" />
                      )}
                      <span className={stat.up ? 'text-emerald-600' : 'text-red-600'}>
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Chart */}
      <Card className="mb-8 py-0 gap-0">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="size-5" />
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : stats?.monthlySales && stats.monthlySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No sales data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="py-0 gap-0">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 text-xs font-semibold text-muted-foreground">Order ID</th>
                    <th className="pb-2 text-xs font-semibold text-muted-foreground">Customer</th>
                    <th className="pb-2 text-xs font-semibold text-muted-foreground">Date</th>
                    <th className="pb-2 text-xs font-semibold text-muted-foreground">Total</th>
                    <th className="pb-2 text-xs font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 text-sm font-mono">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3 text-sm">{order.user?.name || 'Unknown'}</td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm font-medium">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3">
                        <Badge
                          className={`text-xs border-0 ${
                            statusColors[order.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No orders yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

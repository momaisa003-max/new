'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ChevronLeft,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { OrderType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersView() {
  const navigate = useAppStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate({ page: 'home' });
      return;
    }
    fetch('/api/orders?admin=true')
      .then((res) => res.json())
      .then((data) => {
        const ord = data.orders || data || [];
        setOrders(Array.isArray(ord) ? ord : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin()) return null;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        toast.success('Order status updated');
      } else {
        toast.error('Failed to update order status');
      }
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const adminNav = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'admin' as const },
    { icon: Package, label: 'Products', page: 'admin-products' as const },
    { icon: ShoppingBag, label: 'Orders', page: 'admin-orders' as const },
    { icon: Users, label: 'Users', page: 'admin-users' as const },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.page === 'admin-orders';
              return (
                <button
                  key={item.page}
                  onClick={() => navigate({ page: item.page })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Button variant="ghost" size="sm" onClick={() => navigate({ page: 'admin' })} className="mb-2">
            <ChevronLeft className="size-4 mr-1" />
            Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Orders</h1>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                      Order ID
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                      Customer
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                      Payment
                    </th>
                    <th className="text-right p-3 text-xs font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-muted/30">
                      <td className="p-3 text-sm font-mono">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-3 text-sm hidden sm:table-cell">
                        {order.user?.name || 'Unknown'}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm font-medium">
                        {formatPrice(order.total)}
                      </td>
                      <td className="p-3">
                        <Select
                          value={order.status}
                          onValueChange={(v) => handleStatusChange(order.id, v)}
                        >
                          <SelectTrigger className="h-7 text-xs w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            order.paymentStatus === 'paid'
                              ? 'border-emerald-200 text-emerald-700'
                              : 'border-yellow-200 text-yellow-700'
                          }`}
                        >
                          {order.paymentStatus.charAt(0).toUpperCase() +
                            order.paymentStatus.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate({ page: 'order-detail', orderId: order.id })
                          }
                        >
                          <Eye className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

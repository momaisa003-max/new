'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';
import type { OrderType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderDetailView() {
  const view = useAppStore((s) => s.view);
  const navigate = useAppStore((s) => s.navigate);
  const orderId = view.page === 'order-detail' ? view.orderId : '';

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="size-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <Button variant="outline" onClick={() => navigate({ page: 'orders' })}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate({ page: 'orders' })}
      >
        <ArrowLeft className="size-4 mr-1" />
        Back to Orders
      </Button>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Badge
          className={`text-sm border-0 ${
            statusColors[order.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Items */}
        <Card className="py-0 gap-0">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="size-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{item.product?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} &times; {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shipping === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    formatPrice(order.shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Payment */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="py-0 gap-0">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="size-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm">
                {order.shippingAddress?.name}
                <br />
                {order.shippingAddress?.street}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                {order.shippingAddress?.zipCode}
                <br />
                {order.shippingAddress?.country}
              </p>
            </CardContent>
          </Card>

          <Card className="py-0 gap-0">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="size-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm">
                <span className="capitalize">{order.paymentMethod}</span>
              </p>
              <Badge
                className={`mt-2 text-xs border-0 ${
                  order.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

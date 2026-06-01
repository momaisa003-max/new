'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { CartItemType } from '@/lib/types';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/utils';
import { toast } from 'sonner';

export default function CartView() {
  const navigate = useAppStore((s) => s.navigate);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (user) await fetchCart();
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, fetchCart]);

  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleRemove = async (item: CartItemType) => {
    await removeItem(item.id);
    toast.success('Item removed from cart');
  };

  const handleQuantityChange = async (item: CartItemType, newQty: number) => {
    if (newQty < 1) return;
    await updateQuantity(item.id, newQty);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg">
                <Skeleton className="size-24 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="size-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => navigate({ page: 'products' })}
        >
          Continue Shopping
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              {/* Image */}
              <button
                onClick={() =>
                  item.product &&
                  navigate({ page: 'product-detail', productId: item.product.id })
                }
                className="relative size-24 sm:size-28 rounded-md overflow-hidden bg-muted shrink-0"
              >
                {item.product?.images?.[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product?.name || 'Product'}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ShoppingBag className="size-8 text-muted-foreground/30" />
                  </div>
                )}
              </button>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-medium text-sm sm:text-base line-clamp-2 cursor-pointer hover:text-emerald-600"
                  onClick={() =>
                    item.product &&
                    navigate({ page: 'product-detail', productId: item.product.id })
                  }
                >
                  {item.product?.name || 'Unknown Product'}
                </h3>
                {item.product?.comparePrice && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.product.comparePrice)}
                    </span>
                    <span className="text-xs text-red-600 font-medium">
                      Save{' '}
                      {Math.round(
                        ((item.product.comparePrice - item.product.price) /
                          item.product.comparePrice) *
                          100
                      )}
                      %
                    </span>
                  </div>
                )}
                <p className="text-lg font-bold text-emerald-600 mt-1">
                  {formatPrice(item.product?.price || 0)}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemove(item)}
                  >
                    <Trash2 className="size-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <Card className="h-fit sticky top-24 py-0 gap-0">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Tax</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-emerald-600">{formatPrice(total)}</span>
            </div>
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-muted-foreground">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping!
              </p>
            )}
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
              size="lg"
              onClick={() => navigate({ page: 'checkout' })}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate({ page: 'products' })}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

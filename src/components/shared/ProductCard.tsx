'use client';

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Rating from '@/components/shared/Rating';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useAppStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const isLoading = useCartStore((s) => s.isLoading);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      navigate({ page: 'login' });
      return;
    }
    await addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg border-border/50 py-0 gap-0"
      onClick={() => navigate({ page: 'product-detail', productId: product.id })}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <ShoppingCart className="size-12 text-muted-foreground/30" />
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Out of Stock</span>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex flex-col gap-2">
        <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] leading-5 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>
        <Rating value={product.rating} size="sm" count={product.reviewCount} />
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-emerald-600">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isLoading}
        >
          <ShoppingCart className="size-4" />
          {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
}

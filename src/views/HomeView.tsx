'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Zap, TrendingUp, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';
import ProductCard from '@/components/shared/ProductCard';
import type { Product, Category } from '@/lib/types';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/utils';

export default function HomeView() {
  const navigate = useAppStore((s) => s.navigate);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Try fetching products first
        const prodRes = await fetch('/api/products?limit=8');
        const prodData = await prodRes.json();
        const products = prodData.products || prodData || [];

        if (Array.isArray(products) && products.length === 0 && !seeded) {
          // Seed the database
          await fetch('/api/seed', { method: 'GET' });
          setSeeded(true);
          // Re-fetch after seeding
          const reRes = await fetch('/api/products?limit=8');
          const reData = await reRes.json();
          const reProducts = reData.products || reData || [];
          setFeaturedProducts(Array.isArray(reProducts) ? reProducts.slice(0, 8) : []);

          const dealRes = await fetch('/api/products?sort=price_asc&limit=4');
          const dealData = await dealRes.json();
          const dealProducts = dealData.products || dealData || [];
          setDeals(Array.isArray(dealProducts) ? dealProducts.slice(0, 4) : []);
        } else if (Array.isArray(products) && products.length > 0) {
          setFeaturedProducts(products.slice(0, 8));
          const dealRes = await fetch('/api/products?sort=price_asc&limit=4');
          const dealData = await dealRes.json();
          const dealProducts = dealData.products || dealData || [];
          setDeals(Array.isArray(dealProducts) ? dealProducts.slice(0, 4) : []);
        }

        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (Array.isArray(catData)) {
          setCategories(catData);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [seeded]);

  const categoryIcons = [Zap, TrendingUp, Tag, Zap, TrendingUp, Tag, Zap, TrendingUp];
  const categoryColors = [
    'bg-emerald-100 text-emerald-600',
    'bg-amber-100 text-amber-600',
    'bg-rose-100 text-rose-600',
    'bg-sky-100 text-sky-600',
    'bg-purple-100 text-purple-600',
    'bg-orange-100 text-orange-600',
    'bg-teal-100 text-teal-600',
    'bg-indigo-100 text-indigo-600',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Everything You Need,{' '}
              <span className="text-emerald-200">All in One Place</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8">
              Discover millions of products at unbeatable prices. Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold"
                onClick={() => navigate({ page: 'products' })}
              >
                Shop Now <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate({ page: 'products', search: 'deals' })}
              >
                Today&apos;s Deals
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Button
            variant="ghost"
            className="text-emerald-600 hover:text-emerald-700"
            onClick={() => navigate({ page: 'products' })}
          >
            View All <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }, (_, i) => (
                <Card key={i} className="py-0 gap-0">
                  <CardContent className="p-4 flex flex-col items-center gap-3">
                    <Skeleton className="size-12 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </CardContent>
                </Card>
              ))
            : categories.slice(0, 6).map((cat, i) => {
                const IconComp = categoryIcons[i % categoryIcons.length];
                return (
                  <Card
                    key={cat.id}
                    className="py-0 gap-0 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate({ page: 'products', categoryId: cat.slug })}
                  >
                    <CardContent className="p-4 flex flex-col items-center gap-3">
                      <div
                        className={`size-12 rounded-full flex items-center justify-center ${
                          categoryColors[i % categoryColors.length]
                        }`}
                      >
                        <IconComp className="size-6" />
                      </div>
                      <span className="text-sm font-medium text-center">{cat.name}</span>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Button
              variant="ghost"
              className="text-emerald-600 hover:text-emerald-700"
              onClick={() => navigate({ page: 'products' })}
            >
              See More <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: 8 }, (_, i) => (
                  <Card key={i} className="py-0 gap-0">
                    <Skeleton className="aspect-square rounded-t-xl" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="size-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900">Today&apos;s Deals</h2>
          </div>
          <Button
            variant="ghost"
            className="text-amber-600 hover:text-amber-700"
            onClick={() => navigate({ page: 'products', search: 'deals' })}
          >
            View All Deals <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 4 }, (_, i) => (
                <Card key={i} className="py-0 gap-0">
                  <Skeleton className="aspect-square rounded-t-xl" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            : deals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-3xl font-bold mb-3">Free Shipping on Orders Over {formatPrice(FREE_SHIPPING_THRESHOLD)}</h2>
          <p className="text-amber-100 mb-6 text-lg">
            Shop now and save on delivery costs!
          </p>
          <Button
            size="lg"
            className="bg-white text-amber-600 hover:bg-amber-50 font-semibold"
            onClick={() => navigate({ page: 'products' })}
          >
            Start Shopping
          </Button>
        </div>
      </section>
    </div>
  );
}

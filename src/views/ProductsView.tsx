'use client';

import { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAppStore } from '@/store/useAppStore';
import ProductCard from '@/components/shared/ProductCard';
import type { Product, Category } from '@/lib/types';

export default function ProductsView() {
  const view = useAppStore((s) => s.view);
  const navigate = useAppStore((s) => s.navigate);

  const categoryId = view.page === 'products' ? view.categoryId : undefined;
  const searchQuery = view.page === 'products' ? view.search : undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categoryId);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryId);
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', '12');
        if (selectedCategory) params.set('category', selectedCategory);
        if (searchQuery) params.set('search', searchQuery);
        if (sort) params.set('sort', sort);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        const prods = data.products || data || [];
        setProducts(Array.isArray(prods) ? prods : []);
        setTotalPages(data.totalPages || Math.ceil((data.total || prods.length) / 12) || 1);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, searchQuery, sort, page]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === selectedCategory),
    [categories, selectedCategory]
  );

  const filterContent = (
    <div className="space-y-2">
      <button
        onClick={() => {
          setSelectedCategory(undefined);
          navigate({ page: 'products', search: searchQuery });
          setMobileFilterOpen(false);
        }}
        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
          !selectedCategory
            ? 'bg-emerald-50 text-emerald-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => {
            setSelectedCategory(cat.slug);
            navigate({ page: 'products', categoryId: cat.slug, search: searchQuery });
            setMobileFilterOpen(false);
          }}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            selectedCategory === cat.slug
              ? 'bg-emerald-50 text-emerald-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {cat.name}
          {cat.productCount !== undefined && (
            <span className="text-muted-foreground ml-1">({cat.productCount})</span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : activeCategory
                ? activeCategory.name
                : 'All Products'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile filter */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <SlidersHorizontal className="size-4 mr-1" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">{filterContent}</div>
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters */}
      {(selectedCategory || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {activeCategory?.name || selectedCategory}
              <button
                onClick={() => {
                  setSelectedCategory(undefined);
                  navigate({ page: 'products', search: searchQuery });
                }}
                className="ml-1 hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              &quot;{searchQuery}&quot;
              <button
                onClick={() => navigate({ page: 'products', categoryId: selectedCategory })}
                className="ml-1 hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-24">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">Categories</h3>
            {filterContent}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 12 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate({ page: 'products' })}
              >
                Browse All Products
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          className={`w-9 h-9 p-0 ${
                            page === pageNum
                              ? 'bg-emerald-600 hover:bg-emerald-700'
                              : ''
                          }`}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && <span className="px-2">...</span>}
                    {totalPages > 5 && (
                      <Button
                        variant={page === totalPages ? 'default' : 'outline'}
                        size="sm"
                        className="w-9 h-9 p-0"
                        onClick={() => setPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

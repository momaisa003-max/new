'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Minus, Plus, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Rating from '@/components/shared/Rating';
import type { Product, ReviewType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductDetailView() {
  const view = useAppStore((s) => s.view);
  const navigate = useAppStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const cartLoading = useCartStore((s) => s.isLoading);

  const productId = view.page === 'product-detail' ? view.productId : '';

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((prodData) => {
        setProduct(prodData);
        setReviews(prodData?.reviews || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      navigate({ page: 'login' });
      return;
    }
    if (!product) return;
    await addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleSubmitReview = async () => {
    if (!user || !product) return;
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast.error('Please fill in all review fields');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setReviewTitle('');
        setReviewComment('');
        setReviewRating(5);
        toast.success('Review submitted successfully!');
      } else {
        toast.error('Failed to submit review');
      }
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button onClick={() => navigate({ page: 'products' })}>Browse Products</Button>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images
    : ['https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image'];
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6 flex-wrap">
        <button
          onClick={() => navigate({ page: 'home' })}
          className="hover:text-emerald-600 transition-colors"
        >
          Home
        </button>
        <ChevronRight className="size-3" />
        <button
          onClick={() => navigate({ page: 'products' })}
          className="hover:text-emerald-600 transition-colors"
        >
          Products
        </button>
        {product.category && (
          <>
            <ChevronRight className="size-3" />
            <button
              onClick={() =>
                navigate({ page: 'products', categoryId: product.category!.slug })
              }
              className="hover:text-emerald-600 transition-colors"
            >
              {product.category.name}
            </button>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm">
                -{discount}%
              </Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative size-16 sm:size-20 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${
                    i === selectedImage
                      ? 'border-emerald-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.sku && (
              <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Rating value={product.rating} size="md" showValue count={product.reviewCount} />
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-emerald-600">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            {discount > 0 && (
              <Badge className="bg-red-100 text-red-700 border-0">
                Save {discount}%
              </Badge>
            )}
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Stock & Quantity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Availability:</span>
              {product.stock > 0 ? (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-700 border-0">
                  Out of Stock
                </Badge>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || cartLoading}
              >
                <ShoppingCart className="size-5 mr-2" />
                {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || cartLoading}
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Separator className="mb-8" />
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rating breakdown */}
          <div className="space-y-4">
            <div className="text-center p-6 bg-muted rounded-xl">
              <div className="text-5xl font-bold text-gray-900">{product.rating.toFixed(1)}</div>
              <Rating value={product.rating} size="lg" />
              <p className="text-sm text-muted-foreground mt-2">
                {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Review list */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
                        {(review.user?.name || 'U')[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-sm">{review.user?.name || 'Anonymous'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Rating value={review.rating} size="sm" />
                  {review.title && (
                    <h4 className="font-semibold text-sm">{review.title}</h4>
                  )}
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </div>
            )}

            {/* Write review */}
            {user && (
              <div className="border rounded-lg p-4 space-y-4 mt-6">
                <h3 className="font-semibold">Write a Review</h3>
                <div>
                  <Label className="mb-2 block text-sm">Rating</Label>
                  <Rating
                    value={reviewRating}
                    readOnly={false}
                    onChange={setReviewRating}
                    size="lg"
                  />
                </div>
                <div>
                  <Label htmlFor="review-title" className="mb-2 block text-sm">
                    Title
                  </Label>
                  <Input
                    id="review-title"
                    placeholder="Summary of your review"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="review-comment" className="mb-2 block text-sm">
                    Review
                  </Label>
                  <Textarea
                    id="review-comment"
                    placeholder="Share your experience with this product"
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ShoppingCart,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Mail,
  ChevronLeft,
  Upload,
  X,
  Link,
  ImagePlus,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { Product, Category } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminProductsView() {
  const navigate = useAppStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formComparePrice, setFormComparePrice] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formTags, setFormTags] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products?limit=100&sort=newest&admin=true');
      const data = await res.json();
      setProducts(data.products || data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate({ page: 'home' });
      return;
    }
    fetchProducts();
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setCategories(d);
      })
      .catch(() => {});
  }, [user, isAdmin, navigate, fetchProducts]);

  if (!user || !isAdmin()) return null;

  const openCreateDialog = () => {
    setEditProduct(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.price.toString());
    setFormComparePrice(product.comparePrice?.toString() || '');
    setFormCategoryId(product.categoryId);
    setFormStock(product.stock.toString());
    setFormImages(product.images || []);
    setFormTags(product.tags?.join(', ') || '');
    setFormActive(product.active);
    setFormFeatured(product.featured);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormComparePrice('');
    setFormCategoryId('');
    setFormStock('');
    setFormImages([]);
    setFormTags('');
    setFormActive(true);
    setFormFeatured(false);
    setUrlInput('');
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Client-side validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported image type`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB limit`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setFormImages((prev) => [...prev, data.url]);
          uploadedCount++;
        } else {
          const data = await res.json();
          toast.error(data.error || `Failed to upload ${file.name}`);
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (uploadedCount > 0) {
      toast.success(`${uploadedCount} image${uploadedCount > 1 ? 's' : ''} uploaded successfully`);
    }

    setUploading(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      toast.error('Please enter an image URL');
      return;
    }
    // Basic URL validation
    try {
      new URL(trimmed);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }
    setFormImages((prev) => [...prev, trimmed]);
    setUrlInput('');
    toast.success('Image URL added');
  };

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorderImage = (fromIndex: number, toIndex: number) => {
    setFormImages((prev) => {
      const newImages = [...prev];
      const [moved] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, moved);
      return newImages;
    });
  };

  const handleSave = async () => {
    if (!formName || !formPrice || !formCategoryId || !formStock) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formName,
        description: formDescription,
        price: parseFloat(formPrice),
        comparePrice: formComparePrice ? parseFloat(formComparePrice) : null,
        categoryId: formCategoryId,
        stock: parseInt(formStock),
        images: formImages,
        tags: formTags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        active: formActive,
        featured: formFeatured,
      };

      let res;
      if (editProduct) {
        res = await fetch(`/api/products/${editProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        toast.success(editProduct ? 'Product updated' : 'Product created');
        setDialogOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save product');
      }
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      const res = await fetch(`/api/products/${deleteProduct.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        setDeleteDialogOpen(false);
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminNav = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'admin' as const },
    { icon: Package, label: 'Products', page: 'admin-products' as const },
    { icon: ShoppingBag, label: 'Orders', page: 'admin-orders' as const },
    { icon: Users, label: 'Users', page: 'admin-users' as const },
    { icon: Mail, label: 'Messages', page: 'admin-messages' as const },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.page === 'admin-products';
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
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <Button variant="ghost" size="sm" onClick={() => navigate({ page: 'admin' })} className="mb-2">
                <ChevronLeft className="size-4 mr-1" />
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
            </div>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={openCreateDialog}
            >
              <Plus className="size-4 mr-1" />
              Add Product
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Products table */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                      Product
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                      Category
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                      Price
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                      Stock
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                      Status
                    </th>
                    <th className="text-right p-3 text-xs font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 rounded-md overflow-hidden bg-muted shrink-0">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <ShoppingCart className="size-4 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {product.name}
                            </p>
                            {product.featured && (
                              <Badge className="text-xs bg-amber-100 text-amber-700 border-0">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {product.category?.name || '-'}
                      </td>
                      <td className="p-3 text-sm font-medium">
                        {formatPrice(product.price)}
                      </td>
                      <td className="p-3 text-sm hidden md:table-cell">
                        <Badge
                          variant="secondary"
                          className={`border-0 ${
                            product.stock > 10
                              ? 'bg-emerald-100 text-emerald-700'
                              : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.stock}
                        </Badge>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge
                          variant="secondary"
                          className={`border-0 ${
                            product.active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-red-500 hover:text-red-700"
                            onClick={() => {
                              setDeleteProduct(product);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Product Name *</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Product name"
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Compare Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formComparePrice}
                  onChange={(e) => setFormComparePrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Stock *</Label>
                <Input
                  type="number"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Image Management Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Product Images</Label>

              {/* Image Tabs: Upload from Device / Add URL */}
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="upload" className="gap-2">
                    <Upload className="size-4" />
                    Upload from Device
                  </TabsTrigger>
                  <TabsTrigger value="url" className="gap-2">
                    <Link className="size-4" />
                    Add Image URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-3">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      uploading
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!uploading) {
                        handleFileUpload(e.dataTransfer.files);
                      }
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="size-8 text-emerald-600 animate-spin" />
                        <p className="text-sm text-emerald-600 font-medium">Uploading...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImagePlus className="size-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          Drag & drop images here, or
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="size-4 mr-1" />
                          Browse Files
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPEG, PNG, GIF, WebP, SVG • Max 5MB per file
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="url" className="mt-3">
                  <div className="flex gap-2">
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddUrl();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      onClick={handleAddUrl}
                    >
                      <Plus className="size-4 mr-1" />
                      Add URL
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the full URL of the image and click Add URL
                  </p>
                </TabsContent>
              </Tabs>

              {/* Image Preview Grid */}
              {formImages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {formImages.length} image{formImages.length !== 1 ? 's' : ''} added
                      {formImages.length > 1 && (
                        <span className="text-xs ml-1">(drag to reorder, first image is primary)</span>
                      )}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 text-xs h-7"
                      onClick={() => setFormImages([])}
                    >
                      Remove All
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {formImages.map((img, index) => (
                      <div
                        key={`${img}-${index}`}
                        className="relative group rounded-lg border-2 overflow-hidden bg-muted aspect-square cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', String(index));
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                          if (!isNaN(fromIndex) && fromIndex !== index) {
                            handleReorderImage(fromIndex, index);
                          }
                        }}
                      >
                        <Image
                          src={img}
                          alt={`Product image ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        {index === 0 && (
                          <Badge className="absolute top-1 left-1 text-[10px] bg-emerald-600 text-white border-0 px-1.5 py-0">
                            Primary
                          </Badge>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="electronics, gadget, popular"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete &quot;{deleteProduct?.name}&quot;? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

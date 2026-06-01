'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, Edit, Save, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function YourAccountView() {
  const navigate = useAppStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const cartItems = useCartStore((s) => s.items);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate({ page: 'login' });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg col-span-2" />
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) {
        toast.success('Profile updated successfully');
        setEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Account</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="py-0 gap-0 md:row-span-2">
          <CardContent className="p-6 text-center">
            <div className="size-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {isAdmin() && (
              <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                Admin
              </span>
            )}
            <Separator className="my-4" />
            <div className="space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cart Items</span>
                <span className="font-medium">{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cart Total</span>
                <span className="font-medium text-emerald-600">{formatPrice(getSubtotal())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="md:col-span-2 py-0 gap-0">
          <CardHeader className="p-6 pb-0 flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="size-5" />
              Personal Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (editing) handleSave();
                else setEditing(true);
              }}
              disabled={saving}
            >
              {editing ? (
                <>
                  <Save className="size-4 mr-1" />
                  {saving ? 'Saving...' : 'Save'}
                </>
              ) : (
                <>
                  <Edit className="size-4 mr-1" />
                  Edit
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                {editing ? (
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                ) : (
                  <p className="text-sm font-medium mt-1">{user.name}</p>
                )}
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm font-medium mt-1 flex items-center gap-1">
                  <Mail className="size-3 text-muted-foreground" />
                  {user.email}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                {editing ? (
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 700 000 000" />
                ) : (
                  <p className="text-sm font-medium mt-1 flex items-center gap-1">
                    <Phone className="size-3 text-muted-foreground" />
                    {user.phone || 'Not set'}
                  </p>
                )}
              </div>
              <div>
                <Label>Role</Label>
                <p className="text-sm font-medium mt-1 flex items-center gap-1">
                  <Shield className="size-3 text-muted-foreground" />
                  {isAdmin() ? 'Administrator' : 'Customer'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="md:col-span-2 py-0 gap-0">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => navigate({ page: 'orders' })}
              >
                <Package className="size-5 mr-3 text-emerald-600" />
                <div className="text-left">
                  <div className="font-medium text-sm">Your Orders</div>
                  <div className="text-xs text-muted-foreground">Track, return, or buy again</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => navigate({ page: 'cart' })}
              >
                <User className="size-5 mr-3 text-emerald-600" />
                <div className="text-left">
                  <div className="font-medium text-sm">Your Cart</div>
                  <div className="text-xs text-muted-foreground">View items in your cart</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => navigate({ page: 'returns' })}
              >
                <MapPin className="size-5 mr-3 text-emerald-600" />
                <div className="text-left">
                  <div className="font-medium text-sm">Returns & Replacements</div>
                  <div className="text-xs text-muted-foreground">Manage returns easily</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => navigate({ page: 'help' })}
              >
                <Shield className="size-5 mr-3 text-emerald-600" />
                <div className="text-left">
                  <div className="font-medium text-sm">Help</div>
                  <div className="text-xs text-muted-foreground">Get support and FAQs</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

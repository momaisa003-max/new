'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ChevronLeft,
  Search,
  Mail,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserType } from '@/lib/types';

export default function AdminUsersView() {
  const navigate = useAppStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate({ page: 'home' });
      return;
    }
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data.users || []);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin()) return null;

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
              const isActive = item.page === 'admin-users';
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                      User
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold shrink-0">
                            {u.name[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Mail className="size-3" />
                          {u.email}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          className={`text-xs border-0 ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.role === 'admin' && <Shield className="size-3 mr-1" />}
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </Badge>
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

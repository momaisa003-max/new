'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Package,
  LayoutDashboard,
  LogOut,
  LogIn,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import SearchBar from '@/components/shared/SearchBar';
import type { Category } from '@/lib/types';

export default function Header() {
  const navigate = useAppStore((s) => s.navigate);
  const view = useAppStore((s) => s.view);
  const itemCount = useCartStore((s) => s.getItemCount());
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout = useAuthStore((s) => s.logout);
  const fetchCart = useCartStore((s) => s.fetchCart);

  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const searchQuery = view.page === 'products' ? view.search : '';

  const handleLogout = async () => {
    await logout();
    navigate({ page: 'home' });
  };

  const categoryLinks = categories.slice(0, 8);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14 gap-4">
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-slate-800">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white">
                <SheetHeader>
                  <SheetTitle className="text-left text-emerald-600">AllShop</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-4">
                  <button
                    onClick={() => { navigate({ page: 'home' }); setMobileMenuOpen(false); }}
                    className="text-left px-4 py-3 rounded-md hover:bg-emerald-50 text-gray-700 font-medium"
                  >
                    Home
                  </button>
                  <p className="px-4 pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Categories
                  </p>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigate({ page: 'products', categoryId: cat.slug });
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2.5 rounded-md hover:bg-emerald-50 text-gray-600 text-sm"
                    >
                      {cat.name}
                    </button>
                  ))}
                  <div className="border-t my-3" />
                  {user ? (
                    <>
                      <button
                        onClick={() => { navigate({ page: 'orders' }); setMobileMenuOpen(false); }}
                        className="text-left px-4 py-3 rounded-md hover:bg-emerald-50 text-gray-700 font-medium"
                      >
                        My Orders
                      </button>
                      {isAdmin() && (
                        <button
                          onClick={() => { navigate({ page: 'admin' }); setMobileMenuOpen(false); }}
                          className="text-left px-4 py-3 rounded-md hover:bg-emerald-50 text-gray-700 font-medium"
                        >
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="text-left px-4 py-3 rounded-md hover:bg-red-50 text-red-600 font-medium"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { navigate({ page: 'login' }); setMobileMenuOpen(false); }}
                      className="text-left px-4 py-3 rounded-md hover:bg-emerald-50 text-gray-700 font-medium"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <button
              onClick={() => navigate({ page: 'home' })}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="bg-emerald-500 text-white font-bold rounded-md px-2 py-1 text-lg">
                A
              </div>
              <span className="text-xl font-bold hidden sm:block">
                All<span className="text-emerald-400">Shop</span>
              </span>
            </button>

            {/* Search bar - desktop */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <SearchBar initialValue={searchQuery || ''} />
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 ml-auto md:ml-0">
              {/* Mobile search */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-slate-800">
                    <SearchIcon className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="bg-slate-900 border-slate-700">
                  <SheetHeader>
                    <SheetTitle className="text-white">Search Products</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <SearchBar initialValue={searchQuery || ''} />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Cart */}
              <Button
                variant="ghost"
                className="text-white hover:bg-slate-800 relative"
                onClick={() => navigate({ page: 'cart' })}
              >
                <ShoppingCart className="size-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 border-0">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
                <span className="hidden lg:inline ml-1">Cart</span>
              </Button>

              {/* User menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-slate-800 gap-1">
                      <User className="size-5" />
                      <span className="hidden lg:inline max-w-[120px] truncate text-sm">
                        {user.name}
                      </span>
                      <ChevronDown className="size-3 hidden lg:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate({ page: 'orders' })}>
                      <Package className="size-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    {isAdmin() && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate({ page: 'admin' })}>
                          <LayoutDashboard className="size-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="size-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  className="text-white hover:bg-slate-800"
                  onClick={() => navigate({ page: 'login' })}
                >
                  <LogIn className="size-5" />
                  <span className="hidden lg:inline ml-1">Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category nav bar - desktop */}
      <div className="bg-slate-800 text-white hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 h-10 overflow-x-auto">
            <button
              onClick={() => navigate({ page: 'products' })}
              className="px-3 py-1.5 text-sm hover:bg-slate-700 rounded whitespace-nowrap transition-colors"
            >
              All Products
            </button>
            {categoryLinks.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate({ page: 'products', categoryId: cat.slug })}
                className="px-3 py-1.5 text-sm hover:bg-slate-700 rounded whitespace-nowrap transition-colors"
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => navigate({ page: 'products', search: 'deals' })}
              className="px-3 py-1.5 text-sm text-amber-400 hover:bg-slate-700 rounded whitespace-nowrap font-medium transition-colors ml-auto"
            >
              Today&apos;s Deals
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

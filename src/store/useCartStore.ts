import { create } from 'zustand';
import type { CartItemType, Product } from '@/lib/types';

interface CartState {
  items: CartItemType[];
  cartId: string | null;
  isLoading: boolean;
  setItems: (items: CartItemType[], cartId: string) => void;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cartId: null,
  isLoading: false,

  setItems: (items, cartId) => set({ items, cartId }),

  addItem: async (product, quantity = 1) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      const data = await res.json();
      if (data.items) {
        set({ items: data.items, cartId: data.cartId, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.items) {
        set({ items: data.items, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.items) {
        set({ items: data.items });
      }
    } catch {
      // silent
    }
  },

  clearCart: () => set({ items: [], cartId: null }),

  fetchCart: async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.items) {
        set({ items: data.items, cartId: data.cartId });
      }
    } catch {
      // silent
    }
  },

  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  getSubtotal: () =>
    get().items.reduce((sum, item) => {
      const price = item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0),
}));

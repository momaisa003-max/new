export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  categoryId: string;
  category?: Category;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  active: boolean;
  sku?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  children?: Category[];
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemType {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface CartType {
  id: string;
  userId: string;
  items: CartItemType[];
}

export interface OrderType {
  id: string;
  userId: string;
  items: OrderItemType[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  user?: UserType;
}

export interface OrderItemType {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface UserType {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
  phone?: string | null;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface ReviewType {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  user?: UserType;
  createdAt: string;
  updatedAt: string;
}

export type AppView =
  | { page: 'home' }
  | { page: 'products'; categoryId?: string; search?: string }
  | { page: 'product-detail'; productId: string }
  | { page: 'cart' }
  | { page: 'checkout' }
  | { page: 'orders' }
  | { page: 'order-detail'; orderId: string }
  | { page: 'admin' }
  | { page: 'admin-products' }
  | { page: 'admin-orders' }
  | { page: 'admin-users' }
  | { page: 'login' }
  | { page: 'register' }
  | { page: 'about' }
  | { page: 'careers' }
  | { page: 'press-releases' }
  | { page: 'sell-on-allshop' }
  | { page: 'affiliate' }
  | { page: 'advertise' }
  | { page: 'payment-methods' }
  | { page: 'shop-with-points' }
  | { page: 'reload-balance' }
  | { page: 'your-account' }
  | { page: 'returns' }
  | { page: 'help' };

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomeView from '@/views/HomeView';
import ProductsView from '@/views/ProductsView';
import ProductDetailView from '@/views/ProductDetailView';
import CartView from '@/views/CartView';
import CheckoutView from '@/views/CheckoutView';
import OrderHistoryView from '@/views/OrderHistoryView';
import OrderDetailView from '@/views/OrderDetailView';
import AdminDashboardView from '@/views/AdminDashboardView';
import AdminProductsView from '@/views/AdminProductsView';
import AdminOrdersView from '@/views/AdminOrdersView';
import AdminUsersView from '@/views/AdminUsersView';
import LoginView from '@/views/LoginView';
import RegisterView from '@/views/RegisterView';
import AboutView from '@/views/AboutView';
import CareersView from '@/views/CareersView';
import PressReleasesView from '@/views/PressReleasesView';
import SellOnAllShopView from '@/views/SellOnAllShopView';
import AffiliateView from '@/views/AffiliateView';
import AdvertiseView from '@/views/AdvertiseView';
import PaymentMethodsView from '@/views/PaymentMethodsView';
import ShopWithPointsView from '@/views/ShopWithPointsView';
import ReloadBalanceView from '@/views/ReloadBalanceView';
import YourAccountView from '@/views/YourAccountView';
import ReturnsView from '@/views/ReturnsView';
import HelpView from '@/views/HelpView';
import ContactView from '@/views/ContactView';
import AdminMessagesView from '@/views/AdminMessagesView';

export default function Home() {
  const view = useAppStore((s) => s.view);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const renderView = () => {
    switch (view.page) {
      case 'home':
        return <HomeView />;
      case 'products':
        return <ProductsView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'orders':
        return <OrderHistoryView />;
      case 'order-detail':
        return <OrderDetailView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'admin-products':
        return <AdminProductsView />;
      case 'admin-orders':
        return <AdminOrdersView />;
      case 'admin-users':
        return <AdminUsersView />;
      case 'login':
        return <LoginView />;
      case 'register':
        return <RegisterView />;
      case 'about':
        return <AboutView />;
      case 'careers':
        return <CareersView />;
      case 'press-releases':
        return <PressReleasesView />;
      case 'sell-on-allshop':
        return <SellOnAllShopView />;
      case 'affiliate':
        return <AffiliateView />;
      case 'advertise':
        return <AdvertiseView />;
      case 'payment-methods':
        return <PaymentMethodsView />;
      case 'shop-with-points':
        return <ShopWithPointsView />;
      case 'reload-balance':
        return <ReloadBalanceView />;
      case 'your-account':
        return <YourAccountView />;
      case 'returns':
        return <ReturnsView />;
      case 'help':
        return <HelpView />;
      case 'contact':
        return <ContactView />;
      case 'admin-messages':
        return <AdminMessagesView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{renderView()}</main>
      <Footer />
    </div>
  );
}

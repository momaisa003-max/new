'use client';

import { Store, TrendingUp, Truck, Headphones, Shield, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

const steps = [
  { step: 1, title: 'Register', desc: 'Sign up as a seller with your business details and KYC documents.' },
  { step: 2, title: 'List Products', desc: 'Upload your product catalog with images, descriptions, and pricing.' },
  { step: 3, title: 'Sell & Ship', desc: 'Receive orders, pack them, and we handle the delivery logistics.' },
  { step: 4, title: 'Get Paid', desc: 'Receive payments directly to your M-Pesa or bank account weekly.' },
];

const benefits = [
  { icon: TrendingUp, title: 'Reach Millions', desc: 'Access over 2 million active customers across Kenya.' },
  { icon: Truck, title: 'Fulfillment Support', desc: 'Use our logistics network for reliable delivery to all 47 counties.' },
  { icon: Headphones, title: 'Seller Support', desc: '24/7 dedicated support team to help you succeed.' },
  { icon: Shield, title: 'Seller Protection', desc: 'Comprehensive protection against fraudulent claims and chargebacks.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track your sales, traffic, and customer insights in real time.' },
  { icon: Store, title: 'Custom Storefront', desc: 'Build your brand with a customizable shop page on AllShop.' },
];

export default function SellOnAllShopView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <Store className="size-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sell on AllShop</h1>
          <p className="text-lg md:text-xl text-amber-100 max-w-2xl mx-auto">
            Turn your products into profits. Join thousands of Kenyan businesses already growing with AllShop.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">How It Works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="size-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Sell on AllShop</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="py-0 gap-0 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="size-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Simple, Transparent Fees</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
          No hidden costs. You only pay a small commission when you make a sale.
        </p>
        <Card className="max-w-lg mx-auto py-0 gap-0">
          <CardContent className="p-8 space-y-4">
            {[
              'No monthly subscription fees',
              'No listing fees — list unlimited products',
              '5–15% commission per sale (category-dependent)',
              'Free shipping tools and label printing',
              'Free seller analytics dashboard',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Start Selling Today</h2>
          <p className="text-amber-100 mb-6 max-w-lg mx-auto">
            Registration is free and takes just 5 minutes. Start reaching millions of customers.
          </p>
          <Button
            size="lg"
            className="bg-white text-amber-600 hover:bg-amber-50 font-semibold"
            onClick={() => navigate({ page: 'register' })}
          >
            Register as Seller <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

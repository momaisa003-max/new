'use client';

import { Heart, Users, Globe, Shield, Award, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

export default function AboutView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About AllShop</h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            We are on a mission to make shopping easy, affordable, and accessible for everyone across Kenya and beyond.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Founded in 2020, AllShop started as a small online marketplace with a big dream — to connect Kenyan sellers with buyers across the country through a seamless digital experience.
            </p>
            <p>
              What began as a platform for local artisans and small businesses has grown into one of East Africa&apos;s leading e-commerce destinations, offering millions of products across hundreds of categories.
            </p>
            <p>
              Today, AllShop serves millions of customers, supports thousands of sellers, and delivers to every county in Kenya. Our commitment to quality, affordability, and exceptional customer service remains at the heart of everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Heart, title: 'Customer First', desc: 'Every decision we make starts with our customers. Your satisfaction drives our innovation.' },
              { icon: Users, title: 'Community', desc: 'We empower local sellers and small businesses to reach customers nationwide.' },
              { icon: Globe, title: 'Accessibility', desc: 'Making quality products available to everyone, everywhere in Kenya.' },
              { icon: Shield, title: 'Trust & Safety', desc: 'Secure payments, verified sellers, and buyer protection on every order.' },
              { icon: Award, title: 'Quality', desc: 'We hold our sellers to high standards so you always get the best products.' },
              { icon: Leaf, title: 'Sustainability', desc: 'Committed to eco-friendly packaging and reducing our carbon footprint.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="py-0 gap-0 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">AllShop by the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: '2M+', label: 'Active Customers' },
            { value: '15K+', label: 'Sellers' },
            { value: '1M+', label: 'Products' },
            { value: '47', label: 'Counties Served' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
            Join millions of happy customers and discover everything you need on AllShop.
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold"
            onClick={() => navigate({ page: 'products' })}
          >
            Explore Products
          </Button>
        </div>
      </section>
    </div>
  );
}

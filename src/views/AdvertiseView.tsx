'use client';

import { Megaphone, Target, BarChart3, Smartphone, Zap, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdvertiseView() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <Megaphone className="size-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Advertise Your Products</h1>
          <p className="text-lg md:text-xl text-rose-100 max-w-2xl mx-auto">
            Put your brand in front of millions of engaged shoppers across Kenya with AllShop Advertising.
          </p>
        </div>
      </section>

      {/* Ad Solutions */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Advertising Solutions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Target, title: 'Sponsored Products', desc: 'Appear at the top of search results and product pages. Pay only when customers click your ad.' },
            { icon: Megaphone, title: 'Display Ads', desc: 'Banner ads across AllShop\'s homepage, category pages, and checkout flow for maximum visibility.' },
            { icon: Smartphone, title: 'Mobile Ads', desc: 'Reach customers on the go with optimized mobile ad placements in the AllShop app.' },
            { icon: BarChart3, title: 'Retargeting', desc: 'Re-engage customers who viewed your products but didn\'t purchase with personalized ads.' },
            { icon: Zap, title: 'Flash Deals', desc: 'Feature your products in our daily deals section for a burst of high-intent traffic.' },
            { icon: Shield, title: 'Brand Protection', desc: 'Ensure your ads only appear next to content that aligns with your brand values.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="py-0 gap-0 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="size-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Advertising Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '2M+', label: 'Daily Impressions' },
              { value: '4.2%', label: 'Average CTR' },
              { value: '12x', label: 'Avg. ROAS' },
              { value: '500+', label: 'Active Advertisers' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-rose-600 mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-rose-500 text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Ready to Grow Your Brand?</h2>
          <p className="text-rose-100 mb-6 max-w-lg mx-auto">
            Start advertising on AllShop and reach millions of potential customers. Minimum spend starts at just Ksh 5,000.
          </p>
          <Button
            size="lg"
            className="bg-white text-rose-600 hover:bg-rose-50 font-semibold"
          >
            Start Advertising <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

'use client';

import { Users, DollarSign, BarChart3, Link2, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';

export default function AffiliateView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-violet-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <Users className="size-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Become an AllShop Affiliate</h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            Earn commissions by promoting AllShop products. Share links, drive sales, and get paid — it&apos;s that simple.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">How the Affiliate Program Works</h2>
        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { icon: Link2, title: '1. Share Links', desc: 'Get unique affiliate links for any product or category on AllShop. Share them on your blog, social media, or website.' },
            { icon: BarChart3, title: '2. Drive Sales', desc: 'When someone clicks your link and makes a purchase, the sale is tracked to your affiliate account automatically.' },
            { icon: DollarSign, title: '3. Earn Commission', desc: 'Earn up to 10% commission on every qualifying sale. Payouts are made monthly via M-Pesa or bank transfer.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center">
                <div className="size-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Icon className="size-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Commission Tiers</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { tier: 'Starter', sales: '0–50 sales/month', commission: '5%', color: 'bg-gray-100 text-gray-700' },
              { tier: 'Pro', sales: '51–200 sales/month', commission: '7.5%', color: 'bg-purple-100 text-purple-700' },
              { tier: 'Elite', sales: '200+ sales/month', commission: '10%', color: 'bg-amber-100 text-amber-700' },
            ].map((item) => (
              <Card key={item.tier} className="py-0 gap-0 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Badge className={`mb-3 text-sm border-0 ${item.color}`}>{item.tier}</Badge>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{item.commission}</div>
                  <p className="text-xs text-muted-foreground">{item.sales}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Join Our Program</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Gift, title: 'Bonus Rewards', desc: 'Earn extra bonuses during promotional periods and holidays.' },
            { icon: BarChart3, title: 'Real-Time Stats', desc: 'Track clicks, conversions, and earnings from your dashboard.' },
            { icon: DollarSign, title: 'Monthly Payouts', desc: 'Reliable monthly payments via M-Pesa or bank transfer.' },
            { icon: Users, title: 'Dedicated Support', desc: 'Get help from our affiliate team whenever you need it.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="py-0 gap-0">
                <CardContent className="p-5 text-center">
                  <Icon className="size-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-600 text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Start Earning Today</h2>
          <p className="text-purple-100 mb-6 max-w-lg mx-auto">
            Join thousands of affiliates already earning with AllShop. Sign up is free and takes just a few minutes.
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
            onClick={() => navigate({ page: 'register' })}
          >
            Join Affiliate Program <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

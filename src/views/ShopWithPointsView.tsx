'use client';

import { Star, Gift, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

export default function ShopWithPointsView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <Star className="size-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop with Points</h1>
          <p className="text-lg md:text-xl text-amber-100 max-w-2xl mx-auto">
            Earn AllShop Points on every purchase and redeem them for discounts, free products, and exclusive rewards.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">How AllShop Points Work</h2>
        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { icon: ShoppingBag, title: '1. Shop', desc: 'Make purchases on AllShop and earn 1 point for every Ksh 100 spent.' },
            { icon: Star, title: '2. Accumulate', desc: 'Watch your points balance grow. Bonus points during promotions and holidays.' },
            { icon: Gift, title: '3. Redeem', desc: 'Use your points at checkout for discounts, free shipping, or free products.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center">
                <div className="size-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <Icon className="size-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Points Value */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Points Value & Tiers</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { tier: 'Bronze', points: '0–999', rate: '100 pts = Ksh 10', color: 'bg-orange-100 text-orange-700' },
              { tier: 'Silver', points: '1,000–4,999', rate: '100 pts = Ksh 15', color: 'bg-gray-200 text-gray-700' },
              { tier: 'Gold', points: '5,000+', rate: '100 pts = Ksh 25', color: 'bg-amber-100 text-amber-700' },
            ].map((item) => (
              <Card key={item.tier} className="py-0 gap-0 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${item.color}`}>
                    {item.tier}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{item.rate}</div>
                  <p className="text-xs text-muted-foreground">{item.points} points</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Earn */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Ways to Earn Points</h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {[
            { action: 'Make a purchase', points: '1 pt per Ksh 100' },
            { action: 'Write a product review', points: '50 pts' },
            { action: 'Refer a friend', points: '500 pts' },
            { action: 'Sign up for newsletter', points: '200 pts' },
            { action: 'Birthday bonus', points: '300 pts' },
            { action: 'Complete your profile', points: '100 pts' },
          ].map((item) => (
            <Card key={item.action} className="py-0 gap-0">
              <CardContent className="p-4 flex justify-between items-center">
                <span className="text-sm text-gray-900">{item.action}</span>
                <span className="text-sm font-semibold text-amber-600">{item.points}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Start Earning Points Today</h2>
          <p className="text-amber-100 mb-6 max-w-lg mx-auto">
            Every purchase earns you points. Sign up now and get 200 bonus points as a welcome gift!
          </p>
          <Button
            size="lg"
            className="bg-white text-amber-600 hover:bg-amber-50 font-semibold"
            onClick={() => navigate({ page: 'register' })}
          >
            Sign Up & Earn <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

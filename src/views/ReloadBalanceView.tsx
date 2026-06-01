'use client';

import { Wallet, Smartphone, CreditCard, Building, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';

export default function ReloadBalanceView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <Wallet className="size-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reload Your Balance</h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            Top up your AllShop Wallet for faster checkout and exclusive wallet-only deals.
          </p>
        </div>
      </section>

      {/* Top Up Form */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <Card className="py-0 gap-0">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-lg">Top Up Your Wallet</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>Amount (Ksh)</Label>
                <Input type="number" placeholder="Enter amount" className="text-lg" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['500', '1,000', '2,500', '5,000'].map((amount) => (
                  <Button key={amount} variant="outline" size="sm" className="text-xs">
                    Ksh {amount}
                  </Button>
                ))}
              </div>
              <div>
                <Label className="mb-2 block">Payment Method</Label>
                <div className="space-y-2">
                  {[
                    { icon: Smartphone, name: 'M-Pesa', desc: 'Instant top up' },
                    { icon: CreditCard, name: 'Debit/Credit Card', desc: 'Visa, Mastercard' },
                    { icon: Building, name: 'Bank Transfer', desc: '1-2 business days' },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.name}
                        className="w-full flex items-center gap-3 p-3 border rounded-lg hover:border-teal-400 hover:bg-teal-50/30 transition-colors text-left"
                      >
                        <Icon className="size-5 text-teal-600" />
                        <div>
                          <div className="text-sm font-medium">{method.name}</div>
                          <div className="text-xs text-muted-foreground">{method.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Top Up Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Use AllShop Wallet</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { icon: CheckCircle, title: 'Faster Checkout', desc: 'Skip payment details — pay with one tap.' },
              { icon: CheckCircle, title: 'Exclusive Deals', desc: 'Wallet users get access to special discounts and flash sales.' },
              { icon: CheckCircle, title: 'Instant Refunds', desc: 'Returns are credited instantly to your wallet.' },
              { icon: CheckCircle, title: 'No Transaction Fees', desc: 'Zero fees on wallet transactions and top-ups.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="py-0 gap-0">
                  <CardContent className="p-5 flex items-start gap-3">
                    <Icon className="size-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <Card className="py-0 gap-0 border-amber-200 bg-amber-50/50">
            <CardContent className="p-5 flex items-start gap-3">
              <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Important Notice</p>
                <p className="text-muted-foreground">
                  Wallet balance is non-transferable and non-refundable to bank accounts. Balance expires after 12 months of inactivity. By topping up, you agree to our Wallet Terms & Conditions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-600 text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Start Shopping with Your Wallet</h2>
          <p className="text-teal-100 mb-6 max-w-lg mx-auto">
            Top up now and enjoy faster, fee-free checkout on all your purchases.
          </p>
          <Button
            size="lg"
            className="bg-white text-teal-600 hover:bg-teal-50 font-semibold"
            onClick={() => navigate({ page: 'products' })}
          >
            Browse Products <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

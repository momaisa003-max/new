'use client';

import { CreditCard, Smartphone, Building, Wallet, Shield, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const methods = [
  {
    icon: Smartphone,
    name: 'M-Pesa',
    desc: 'Kenya\'s most popular mobile money service. Pay directly from your M-Pesa account with just your phone number.',
    badge: 'Most Popular',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: CreditCard,
    name: 'Credit & Debit Cards',
    desc: 'We accept Visa, Mastercard, and American Express. All transactions are secured with 256-bit SSL encryption.',
    badge: null,
    badgeColor: '',
  },
  {
    icon: Building,
    name: 'Bank Transfer',
    desc: 'Transfer directly from your bank account. Supports all major Kenyan banks including KCB, Equity, and Co-op Bank.',
    badge: null,
    badgeColor: '',
  },
  {
    icon: Wallet,
    name: 'AllShop Wallet',
    desc: 'Store your balance in your AllShop wallet for faster checkout. Top up via M-Pesa, card, or bank transfer.',
    badge: 'Fastest Checkout',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Smartphone,
    name: 'Airtel Money',
    desc: 'Pay conveniently using your Airtel Money mobile wallet.',
    badge: null,
    badgeColor: '',
  },
  {
    icon: CreditCard,
    name: 'PayPal',
    desc: 'International customers can pay securely using their PayPal account.',
    badge: null,
    badgeColor: '',
  },
];

export default function PaymentMethodsView() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <CreditCard className="size-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Methods</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            AllShop offers a variety of safe and convenient payment options to make your shopping experience seamless.
          </p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Accepted Payment Methods</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {methods.map((method) => {
            const Icon = method.icon;
            return (
              <Card key={method.name} className="py-0 gap-0 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      {method.badge && (
                        <Badge className={`text-xs border-0 ${method.badgeColor}`}>{method.badge}</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{method.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Security */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Your Payment Security</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { icon: Shield, title: 'SSL Encryption', desc: 'All payment data is encrypted using 256-bit SSL technology, the same standard used by major banks.' },
              { icon: Shield, title: 'PCI DSS Compliant', desc: 'We are fully PCI DSS compliant, ensuring your card information is handled with the highest security standards.' },
              { icon: Clock, title: 'Fraud Monitoring', desc: 'Our systems monitor every transaction 24/7 for suspicious activity and unauthorized charges.' },
              { icon: CheckCircle, title: 'Buyer Protection', desc: 'If something goes wrong with your order, our Buyer Protection policy ensures you get a full refund.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="py-0 gap-0">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

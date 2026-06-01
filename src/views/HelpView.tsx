'use client';

import { useState } from 'react';
import { HelpCircle, Search, Package, CreditCard, RotateCcw, User, Truck, Shield, ChevronDown, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';

const faqs = [
  {
    category: 'Orders & Shipping',
    icon: Package,
    questions: [
      { q: 'How do I track my order?', a: 'Go to Your Orders, find the order you want to track, and click "Track Package" to see the latest delivery updates.' },
      { q: 'What are the shipping options?', a: 'We offer Standard (3-5 business days), Express (1-2 business days), and Same-Day delivery in Nairobi and Mombasa for orders placed before 12 PM.' },
      { q: 'Do you ship nationwide?', a: 'Yes! We deliver to all 47 counties in Kenya. Remote areas may take an additional 1-2 business days.' },
      { q: 'How much does shipping cost?', a: 'Standard shipping is free on orders over Ksh 6,500. For orders below that, a flat rate of Ksh 300 applies. Express delivery costs Ksh 500.' },
    ],
  },
  {
    category: 'Payments',
    icon: CreditCard,
    questions: [
      { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, credit/debit cards (Visa, Mastercard, AMEX), Airtel Money, PayPal, bank transfer, and AllShop Wallet.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. All transactions are encrypted with 256-bit SSL technology. We are PCI DSS compliant and never store your full card details.' },
      { q: 'Can I pay on delivery?', a: 'Cash on Delivery (COD) is available for orders under Ksh 50,000 in select areas. A small handling fee of Ksh 200 applies.' },
    ],
  },
  {
    category: 'Returns & Refunds',
    icon: RotateCcw,
    questions: [
      { q: 'What is your return policy?', a: 'You can return most items within 30 days of delivery for a full refund. Items must be unused and in original packaging. Some categories have specific return windows.' },
      { q: 'How long do refunds take?', a: 'Refunds are processed within 3-5 business days. M-Pesa and wallet refunds are usually instant. Bank refunds may take up to 7 business days.' },
      { q: 'Who pays for return shipping?', a: 'We cover return shipping costs for damaged, defective, or incorrect items. For other returns, a small fee may apply.' },
    ],
  },
  {
    category: 'Account',
    icon: User,
    questions: [
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a reset link within a few minutes.' },
      { q: 'How do I update my account information?', a: 'Go to Your Account, click Edit on your personal information section, update your details, and click Save.' },
      { q: 'Can I delete my account?', a: 'Yes, you can request account deletion from Your Account settings. Please note this action is permanent and cannot be undone.' },
    ],
  },
];

export default function HelpView() {
  const navigate = useAppStore((s) => s.navigate);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpandedIndex((prev) => (prev === key ? null : key));
  };

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        !searchQuery ||
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero with Search */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <HelpCircle className="size-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto mb-8">
            Find answers to common questions, or get in touch with our support team.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg bg-white text-foreground"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { icon: Truck, label: 'Track Order', action: () => navigate({ page: 'orders' }) },
            { icon: RotateCcw, label: 'Returns', action: () => navigate({ page: 'returns' }) },
            { icon: CreditCard, label: 'Payments', action: () => navigate({ page: 'payment-methods' }) },
            { icon: User, label: 'My Account', action: () => navigate({ page: 'your-account' }) },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors"
              >
                <Icon className="size-6 text-emerald-600" />
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {filteredFaqs.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Icon className="size-5 text-emerald-600" />
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.questions.map((faq, idx) => {
                    const key = `${category.category}-${idx}`;
                    const isExpanded = expandedIndex === key;
                    return (
                      <Card key={key} className="py-0 gap-0">
                        <button
                          className="w-full text-left p-4 flex items-center justify-between"
                          onClick={() => toggleExpand(key)}
                        >
                          <span className="text-sm font-medium text-gray-900 pr-4">{faq.q}</span>
                          {isExpanded ? (
                            <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4">
                            <Separator className="mb-3" />
                            <p className="text-sm text-muted-foreground">{faq.a}</p>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Still Need Help?</h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="py-0 gap-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="size-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-xs text-muted-foreground mb-3">Chat with our support team</p>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
            <Card className="py-0 gap-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Shield className="size-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                <p className="text-xs text-muted-foreground mb-3">support@allshop.co.ke</p>
                <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-600">
                  Send Email
                </Button>
              </CardContent>
            </Card>
            <Card className="py-0 gap-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <HelpCircle className="size-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                <p className="text-xs text-muted-foreground mb-3">0800 123 456 (Toll Free)</p>
                <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-600">
                  Call Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

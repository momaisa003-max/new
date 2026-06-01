'use client';

import { RotateCcw, Package, Clock, Shield, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

export default function ReturnsView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <RotateCcw className="size-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Replacements</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Not satisfied with your purchase? We make returns and replacements easy and hassle-free.
          </p>
        </div>
      </section>

      {/* Return Policy */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Our Return Policy</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="py-0 gap-0">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="size-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">30-Day Return Window</h3>
                <p className="text-sm text-muted-foreground">
                  You have 30 days from the date of delivery to initiate a return. Items must be unused and in their original packaging.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-0 gap-0">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="size-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Package className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Free Return Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  We cover the cost of return shipping for all eligible items. Simply print the prepaid label and drop off the package.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="py-0 gap-0">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="size-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Shield className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Buyer Protection Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  If your item arrives damaged, defective, or significantly different from the description, you&apos;re covered by our Buyer Protection.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Return */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">How to Return an Item</h2>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Go to Orders', desc: 'Find the order with the item you want to return.' },
              { step: '2', title: 'Select Item', desc: 'Choose the item and reason for return.' },
              { step: '3', title: 'Print Label', desc: 'Download and print the prepaid shipping label.' },
              { step: '4', title: 'Ship It', desc: 'Drop off the package at any courier location.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="size-10 rounded-full bg-slate-800 text-white flex items-center justify-center mx-auto mb-3 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligible / Non-Eligible */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          <Card className="py-0 gap-0 border-emerald-200">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-700">
                <CheckCircle className="size-5" />
                Eligible for Return
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
              {[
                'Unused items in original packaging',
                'Items within 30-day window',
                'Damaged or defective products',
                'Wrong item delivered',
                'Items not as described',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="py-0 gap-0 border-red-200">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="size-5" />
                Non-Returnable
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
              {[
                'Downloadable digital products',
                'Personalized/custom-made items',
                'Perishable goods',
                'Intimate and sanitary products',
                'Items with broken seals (select categories)',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-800 text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Need to Return an Item?</h2>
          <p className="text-slate-300 mb-6 max-w-lg mx-auto">
            Go to your orders to initiate a return. It only takes a few minutes.
          </p>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            onClick={() => navigate({ page: 'orders' })}
          >
            View Your Orders <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Check, CreditCard, Truck, ClipboardCheck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import type { ShippingAddress } from '@/lib/types';
import { toast } from 'sonner';

type Step = 'shipping' | 'payment' | 'review' | 'confirmation';

const stepConfig: { key: Step; label: string; icon: typeof Truck }[] = [
  { key: 'shipping', label: 'Shipping', icon: Truck },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'review', label: 'Review', icon: ClipboardCheck },
  { key: 'confirmation', label: 'Confirmation', icon: Check },
];

export default function CheckoutView() {
  const navigate = useAppStore((s) => s.navigate);
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const currentStepIndex = stepConfig.findIndex((s) => s.key === step);

  const validateShipping = () => {
    const { name, street, city, state, zipCode, country } = shippingAddress;
    if (!name || !street || !city || !state || !zipCode || !country) {
      toast.error('Please fill in all required shipping fields');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 'shipping') {
      if (!validateShipping()) return;
      setStep('payment');
    } else if (step === 'payment') {
      setStep('review');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrderId(data.order.id);
        clearCart();
        setStep('confirmation');
        toast.success('Order placed successfully!');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="size-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">
          Add some items to your cart before checking out.
        </p>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => navigate({ page: 'products' })}
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-8">
        {stepConfig.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.key === step;
          const isCompleted = i < currentStepIndex;
          return (
            <div key={s.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`size-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isActive
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="size-5" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-1 hidden sm:block ${
                    isActive ? 'text-emerald-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < stepConfig.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    i < currentStepIndex ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Shipping Step */}
          {step === 'shipping' && (
            <Card className="py-0 gap-0">
              <CardHeader className="p-6 pb-0">
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ship-name">Full Name *</Label>
                    <Input
                      id="ship-name"
                      value={shippingAddress.name}
                      onChange={(e) =>
                        setShippingAddress((a) => ({ ...a, name: e.target.value }))
                      }
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ship-phone">Phone</Label>
                    <Input
                      id="ship-phone"
                      value={shippingAddress.phone || ''}
                      onChange={(e) =>
                        setShippingAddress((a) => ({ ...a, phone: e.target.value }))
                      }
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ship-street">Street Address *</Label>
                  <Input
                    id="ship-street"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress((a) => ({ ...a, street: e.target.value }))
                    }
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ship-city">City *</Label>
                    <Input
                      id="ship-city"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress((a) => ({ ...a, city: e.target.value }))
                      }
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ship-state">State *</Label>
                    <Input
                      id="ship-state"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress((a) => ({ ...a, state: e.target.value }))
                      }
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ship-zip">ZIP Code *</Label>
                    <Input
                      id="ship-zip"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        setShippingAddress((a) => ({ ...a, zipCode: e.target.value }))
                      }
                      placeholder="10001"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ship-country">Country *</Label>
                  <Input
                    id="ship-country"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress((a) => ({ ...a, country: e.target.value }))
                    }
                    placeholder="US"
                  />
                </div>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
                  size="lg"
                  onClick={handleNext}
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <Card className="py-0 gap-0">
              <CardHeader className="p-6 pb-0">
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="size-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Credit / Debit Card</div>
                        <div className="text-xs text-muted-foreground">
                          Visa, Mastercard, AMEX
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="size-5 rounded bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                        P
                      </div>
                      <div>
                        <div className="font-medium">PayPal</div>
                        <div className="text-xs text-muted-foreground">
                          Pay with your PayPal account
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      This is a demo. No real payment will be processed.
                    </p>
                    <div>
                      <Label>Card Number</Label>
                      <Input placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Expiry</Label>
                        <Input placeholder="12/28" />
                      </div>
                      <div>
                        <Label>CVC</Label>
                        <Input placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep('shipping')} className="flex-1">
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setStep('review')}
                  >
                    Review Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Step */}
          {step === 'review' && (
            <Card className="py-0 gap-0">
              <CardHeader className="p-6 pb-0">
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                    SHIPPING ADDRESS
                  </h3>
                  <p className="text-sm">
                    {shippingAddress.name}
                    <br />
                    {shippingAddress.street}
                    <br />
                    {shippingAddress.city}, {shippingAddress.state}{' '}
                    {shippingAddress.zipCode}
                    <br />
                    {shippingAddress.country}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                    PAYMENT METHOD
                  </h3>
                  <p className="text-sm">
                    {paymentMethod === 'card' ? 'Credit / Debit Card' : 'PayPal'}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                    ORDER ITEMS ({items.length})
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="flex-1">
                          {item.product?.name || 'Unknown'} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep('payment')} className="flex-1">
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Confirmation Step */}
          {step === 'confirmation' && (
            <Card className="py-0 gap-0">
              <CardContent className="p-8 text-center">
                <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="size-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Placed Successfully!
                </h2>
                <p className="text-muted-foreground mb-2">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Order ID: <span className="font-mono font-semibold text-foreground">{orderId}</span>
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate({ page: 'orders' })}
                  >
                    View Orders
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => navigate({ page: 'home' })}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {step !== 'confirmation' && (
          <Card className="h-fit sticky top-24 py-0 gap-0">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex-1 truncate mr-2">
                    {item.product?.name || 'Unknown'} x{item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-emerald-600">${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

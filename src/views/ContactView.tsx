'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  Loader2,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['0800 123 456 (Toll Free)', '+254 700 000 000'],
    subtitle: 'Mon-Fri: 8AM - 6PM EAT',
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['support@allshop.co.ke', 'press@allshop.co.ke'],
    subtitle: 'We reply within 24 hours',
  },
  {
    icon: MapPin,
    title: 'Office',
    details: ['AllShop Headquarters', 'Westlands, Nairobi, Kenya'],
    subtitle: 'Open for visits by appointment',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 1:00 PM'],
    subtitle: 'Closed on Sundays & Public Holidays',
  },
];

const categories = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'order', label: 'Order Issue' },
  { value: 'product', label: 'Product Question' },
  { value: 'payment', label: 'Payment Problem' },
  { value: 'shipping', label: 'Shipping & Delivery' },
  { value: 'return', label: 'Returns & Refunds' },
  { value: 'account', label: 'Account Issue' },
  { value: 'seller', label: 'Seller Support' },
  { value: 'partnership', label: 'Business Partnership' },
  { value: 'feedback', label: 'Feedback & Suggestion' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'other', label: 'Other' },
];

export default function ContactView() {
  const navigate = useAppStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmittedId(data.id);
        setSubmitted(true);
        toast.success('Message sent successfully!');
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <CheckCircle className="size-16 mx-auto mb-4 text-emerald-200" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Message Sent!</h1>
            <p className="text-lg text-emerald-100 max-w-xl mx-auto">
              Thank you for contacting us. We&apos;ve received your message and will respond within 24 hours.
            </p>
          </div>
        </section>
        <section className="container mx-auto px-4 py-12">
          <Card className="max-w-lg mx-auto py-0 gap-0">
            <CardContent className="p-8 text-center space-y-4">
              <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="size-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Submission Confirmed</h2>
              <p className="text-sm text-muted-foreground">
                Reference ID: <span className="font-mono font-semibold">{submittedId.slice(-8).toUpperCase()}</span>
              </p>
              <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground text-left space-y-1">
                <p><strong className="text-foreground">What happens next?</strong></p>
                <ul className="list-disc pl-4 space-y-1 mt-2">
                  <li>Our team will review your message within 24 hours</li>
                  <li>You&apos;ll receive a response via email at <strong>{formData.email}</strong></li>
                  <li>For urgent matters, call us at 0800 123 456</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => navigate({ page: 'home' })}
                >
                  Back to Home
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      subject: '',
                      message: '',
                      category: 'general',
                    });
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <Mail className="size-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Have a question, issue, or feedback? We&apos;d love to hear from you. Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="py-0 gap-0 hover:shadow-md transition-shadow">
                <CardContent className="p-5 text-center">
                  <div className="size-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{item.title}</h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-xs text-gray-600">{detail}</p>
                  ))}
                  <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Contact Form + Map/Info */}
      <section className="container mx-auto px-4 py-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="py-0 gap-0">
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageCircle className="size-5 text-emerald-600" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Full Name *</Label>
                      <Input
                        id="contact-name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email Address *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-phone">Phone Number</Label>
                      <Input
                        id="contact-phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => handleChange('category', v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-subject">Subject *</Label>
                    <Input
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-message">Message *</Label>
                    <Textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Tell us how we can help you... (minimum 10 characters)"
                      rows={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.message.length}/5000 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="size-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="py-0 gap-0">
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {[
                  { label: 'FAQs & Help Center', page: 'help' as const },
                  { label: 'Track Your Order', page: 'orders' as const },
                  { label: 'Returns & Refunds', page: 'returns' as const },
                  { label: 'Payment Methods', page: 'payment-methods' as const },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate({ page: item.page })}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 text-sm text-gray-700 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="size-4 text-emerald-600" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Live Chat */}
            <Card className="py-0 gap-0 border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-6 text-center">
                <MessageCircle className="size-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Prefer Live Chat?</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Our support agents are available Mon-Fri, 8AM-6PM EAT
                </p>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                >
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>

            {/* Office Info */}
            <Card className="py-0 gap-0">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Visit Our Office</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Westlands Business Park,<br />Nairobi, Kenya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-emerald-600 shrink-0" />
                    <span>0800 123 456</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-emerald-600 shrink-0" />
                    <span>support@allshop.co.ke</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

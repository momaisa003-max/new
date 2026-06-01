'use client';

import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';

const releases = [
  {
    date: 'February 28, 2025',
    category: 'Product Launch',
    title: 'AllShop Launches Same-Day Delivery in Nairobi and Mombasa',
    excerpt: 'Customers in Nairobi and Mombasa can now receive their orders within hours, setting a new standard for e-commerce delivery speed in Kenya.',
  },
  {
    date: 'January 15, 2025',
    category: 'Partnership',
    title: 'AllShop Partners with M-Pesa for Seamless Payments',
    excerpt: 'The integration of M-Pesa as a primary payment method makes checkout faster and more convenient for millions of Kenyan shoppers.',
  },
  {
    date: 'December 5, 2024',
    category: 'Expansion',
    title: 'AllShop Expands to Uganda and Tanzania',
    excerpt: 'Marking its first international expansion, AllShop now serves customers across East Africa with localized shopping experiences.',
  },
  {
    date: 'October 20, 2024',
    category: 'Sustainability',
    title: 'AllShop Commits to 100% Eco-Friendly Packaging by 2026',
    excerpt: 'As part of our Green Initiative, AllShop will transition all packaging to biodegradable and recyclable materials within two years.',
  },
  {
    date: 'September 1, 2024',
    category: 'Awards',
    title: 'AllShop Named Best E-Commerce Platform in East Africa',
    excerpt: 'Recognized at the Africa Tech Awards for innovation, customer experience, and impact on digital commerce in the region.',
  },
  {
    date: 'July 15, 2024',
    category: 'Product Launch',
    title: 'AllShop Introduces Seller Academy for Small Businesses',
    excerpt: 'Free online training program helps entrepreneurs build successful online businesses with expert-led courses on selling, marketing, and logistics.',
  },
];

const categoryColors: Record<string, string> = {
  'Product Launch': 'bg-emerald-100 text-emerald-700',
  Partnership: 'bg-blue-100 text-blue-700',
  Expansion: 'bg-purple-100 text-purple-700',
  Sustainability: 'bg-teal-100 text-teal-700',
  Awards: 'bg-amber-100 text-amber-700',
};

export default function PressReleasesView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <Newspaper className="size-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Press Releases</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Stay up to date with the latest news, announcements, and milestones from AllShop.
          </p>
        </div>
      </section>

      {/* Press Releases */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {releases.map((release) => (
            <Card key={release.title} className="py-0 gap-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`border-0 text-xs ${categoryColors[release.category] || 'bg-gray-100 text-gray-700'}`}>
                    {release.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    {release.date}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-emerald-600 transition-colors">
                  {release.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{release.excerpt}</p>
                <span className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Media Contact */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Media Inquiries</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            For press and media inquiries, please contact our communications team.
          </p>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => navigate({ page: 'home' })}
          >
            Contact Press Team
          </Button>
        </div>
      </section>
    </div>
  );
}

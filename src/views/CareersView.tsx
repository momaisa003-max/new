'use client';

import { Briefcase, MapPin, Clock, TrendingUp, Heart, Zap, GraduationCap, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';

const openings = [
  { title: 'Senior Frontend Engineer', dept: 'Engineering', location: 'Nairobi, Kenya', type: 'Full-time' },
  { title: 'Product Manager', dept: 'Product', location: 'Nairobi, Kenya', type: 'Full-time' },
  { title: 'Data Analyst', dept: 'Analytics', location: 'Remote', type: 'Full-time' },
  { title: 'Customer Support Lead', dept: 'Support', location: 'Nairobi, Kenya', type: 'Full-time' },
  { title: 'Marketing Specialist', dept: 'Marketing', location: 'Remote', type: 'Full-time' },
  { title: 'Logistics Coordinator', dept: 'Operations', location: 'Mombasa, Kenya', type: 'Full-time' },
  { title: 'UX Designer', dept: 'Design', location: 'Nairobi, Kenya', type: 'Full-time' },
  { title: 'DevOps Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time' },
];

const benefits = [
  { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage for you and your family.' },
  { icon: GraduationCap, title: 'Learning & Growth', desc: 'Annual learning budget, conferences, and mentorship programs.' },
  { icon: Clock, title: 'Flexible Schedule', desc: 'Flexible working hours and remote-friendly policies.' },
  { icon: Coffee, title: 'Great Perks', desc: 'Free meals, team retreats, and a vibrant office culture.' },
  { icon: TrendingUp, title: 'Stock Options', desc: 'Equity participation so you share in our success.' },
  { icon: Zap, title: 'Parental Leave', desc: 'Generous parental leave for all new parents.' },
];

export default function CareersView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join the AllShop Team</h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Help us build the future of e-commerce in Africa. We&apos;re looking for passionate people who want to make a difference.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Work With Us</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="py-0 gap-0 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="size-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
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

      {/* Open Positions */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Open Positions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {openings.map((job) => (
              <Card key={job.title} className="py-0 gap-0 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="border-0 bg-emerald-100 text-emerald-700 text-xs">
                          {job.dept}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="size-3" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 shrink-0">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Don&apos;t See Your Role?</h2>
          <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
            We&apos;re always looking for talented people. Send us your resume and we&apos;ll reach out when there&apos;s a match.
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold"
            onClick={() => navigate({ page: 'home' })}
          >
            Send Your Resume
          </Button>
        </div>
      </section>
    </div>
  );
}

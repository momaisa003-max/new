'use client';

import { useAppStore } from '@/store/useAppStore';

const footerLinks = {
  'Get to Know Us': [
    { label: 'About AllShop', action: { page: 'home' } as const },
    { label: 'Careers', action: { page: 'home' } as const },
    { label: 'Press Releases', action: { page: 'home' } as const },
  ],
  'Make Money with Us': [
    { label: 'Sell on AllShop', action: { page: 'home' } as const },
    { label: 'Become an Affiliate', action: { page: 'home' } as const },
    { label: 'Advertise Your Products', action: { page: 'home' } as const },
  ],
  'AllShop Payment': [
    { label: 'Payment Methods', action: { page: 'home' } as const },
    { label: 'Shop with Points', action: { page: 'home' } as const },
    { label: 'Reload Your Balance', action: { page: 'home' } as const },
  ],
  'Let Us Help You': [
    { label: 'Your Account', action: { page: 'home' } as const },
    { label: 'Your Orders', action: { page: 'orders' } as const },
    { label: 'Returns & Replacements', action: { page: 'home' } as const },
    { label: 'Help', action: { page: 'home' } as const },
  ],
};

export default function Footer() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm py-3 transition-colors"
      >
        Back to top
      </button>

      {/* Links */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-3 text-sm">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.action)}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <button
              onClick={() => navigate({ page: 'home' })}
              className="text-lg font-bold text-white"
            >
              All<span className="text-emerald-400">Shop</span>
            </button>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} AllShop, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

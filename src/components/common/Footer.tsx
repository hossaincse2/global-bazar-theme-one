'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { getStoreMenus, FooterMenuColumn } from '@/services/cmsService';
import { Phone, Mail, MapPin, Send, ShieldCheck, Store } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();
  const [footerColumns, setFooterColumns] = useState<FooterMenuColumn[]>([]);

  const footerLogo = settings?.footer_logo;

  useEffect(() => {
    async function loadMenus() {
      try {
        const data = await getStoreMenus('en');
        if (data?.footer_menu && data.footer_menu.length > 0) {
          setFooterColumns(data.footer_menu);
        }
      } catch (err) {
        console.warn('Using fallback default footer menu:', err);
      }
    }
    loadMenus();
  }, []);

  const defaultFooterColumns: FooterMenuColumn[] = [
    {
      column_title: 'Top Categories',
      links: [
        { title: 'Smartphones & Mobiles', url: '/products?category=electronics' },
        { title: 'Laptops & Accessories', url: '/products?category=electronics' },
        { title: 'Men\'s Fashion', url: '/products?category=fashion' },
        { title: 'Women\'s Fashion', url: '/products?category=fashion' },
        { title: 'Flash Sale Deals', url: '/products?sort_by=discount' },
      ],
    },
    {
      column_title: 'Customer Care',
      links: [
        { title: 'Help Center & Support', url: '/' },
        { title: 'Track Your Order', url: '/' },
        { title: 'Return & Refund Policy', url: '/' },
        { title: 'Shipping & Delivery Info', url: '/' },
        { title: 'Terms & Conditions', url: '/' },
      ],
    },
  ];

  const activeFooterColumns = footerColumns.length > 0 ? footerColumns : defaultFooterColumns;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Company Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              {footerLogo ? (
                <img src={footerLogo} alt={settings?.title || 'Global Bazar'} className="h-10 w-auto object-contain bg-white/10 p-1.5 rounded-lg" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Store className="w-5 h-5" />
                </div>
              )}
              <span className="text-2xl font-black text-white">{settings?.company_name || 'Global Bazar Store'}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings?.footer_description ||
                'Your premier destination for high-quality electronics, smartphones, fashion, and everyday essentials with superfast nationwide delivery.'}
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              {settings?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>{settings.phone}</span>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{settings.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Dynamic Admin-Managed Footer Menu Columns */}
          {activeFooterColumns.map((col, idx) => (
            <div key={idx}>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                {col.column_title}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {col.links.map((linkItem, lIdx) => (
                  <li key={lIdx}>
                    <Link href={linkItem.url || '/'} className="hover:text-white transition">
                      {linkItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Box */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get special discount alerts & new arrival notifications directly in your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full bg-slate-800 text-white text-xs rounded-lg px-3 py-2.5 border border-slate-700 focus:border-blue-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Subscribe Now</span>
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Global Bazar Store. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Verified & Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

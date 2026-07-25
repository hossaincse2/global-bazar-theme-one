'use client';

import React from 'react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { CmsBlock } from '@/types/cms';
import { ShieldCheck, Truck, RefreshCw, CreditCard, Award, Sparkles } from 'lucide-react';

interface TrustBadgeBarProps {
  cmsBlock?: CmsBlock | null;
}

export const TrustBadgeBar: React.FC<TrustBadgeBarProps> = ({ cmsBlock }) => {
  const { settings } = useSiteSettings();

  const iconMap: Record<string, any> = {
    'award': Award,
    'credit-card': CreditCard,
    'refresh-cw': RefreshCw,
    'truck': Truck,
    'shield-check': ShieldCheck,
  };

  const defaultBadges = [
    { title: settings?.trusted_text_2 || 'Official Product', subtitle: 'Guaranteed Quality', icon: Award, color: 'text-blue-600 bg-blue-50' },
    { title: settings?.trusted_text_3 || '0% EMI Available', subtitle: 'Guaranteed Quality', icon: CreditCard, color: 'text-amber-600 bg-amber-50' },
    { title: settings?.trusted_text_4 || 'Easy Exchange', subtitle: 'Guaranteed Quality', icon: RefreshCw, color: 'text-emerald-600 bg-emerald-50' },
    { title: settings?.trusted_text_5 || 'Fastest Delivery', subtitle: 'Guaranteed Quality', icon: Truck, color: 'text-indigo-600 bg-indigo-50' },
    { title: settings?.trusted_text_6 || '100% Secure Payment', subtitle: 'Guaranteed Quality', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50' },
  ];

  const colors = [
    'text-blue-600 bg-blue-50',
    'text-amber-600 bg-amber-50',
    'text-emerald-600 bg-emerald-50',
    'text-indigo-600 bg-indigo-50',
    'text-purple-600 bg-purple-50',
  ];

  const items = cmsBlock?.items && cmsBlock.items.length > 0
    ? cmsBlock.items.map((item, idx) => ({
        title: item.title || 'Quality Assurance',
        subtitle: item.subtitle || 'Guaranteed Quality',
        icon: iconMap[item.icon] || Sparkles,
        color: colors[idx % colors.length],
      }))
    : defaultBadges;

  return (
    <section className="bg-white border-y border-slate-200 py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
        {items.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-xs transition">
              <div className={`p-2.5 rounded-lg shrink-0 ${badge.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">{badge.title}</h5>
                <p className="text-[10px] text-slate-400 font-medium">{badge.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

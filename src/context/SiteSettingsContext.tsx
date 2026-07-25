'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings } from '@/types/settings';
import { getSiteSettings } from '@/services/settingsService';

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  currencyIcon: string;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
  title: 'Global Bazar Store',
  company_name: 'Global Bazar Store',
  currency_icon: '৳',
  currency: 'bdt',
  header_logo: '',
  footer_logo: '',
  fev_icon: '',
  phone: '01639446656',
  email: 'support@globalbazar.com',
  announcement_text: 'Sunday, 6 January, All our branches are open except IDB Branch. Additionally, our online activities are open and operational.',
  inside_dhaka: '70',
  outside_dhaka: '150',
  card_button_text: 'ADD CART',
  trusted_text_2: 'Official Product',
  trusted_text_3: '0% EMI',
  trusted_text_4: 'Exchange',
  trusted_text_5: 'Fastest Delivery',
  trusted_text_6: '100% Secure Payment',
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  currencyIcon: '৳',
  loading: false,
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const fetched = await getSiteSettings();
        if (fetched) {
          // Remove karbar logo references if present in API payload
          const sanitized = { ...fetched };
          if (sanitized.header_logo?.includes('karbar-logo')) sanitized.header_logo = '';
          if (sanitized.footer_logo?.includes('karbar-logo')) sanitized.footer_logo = '';
          if (sanitized.fev_icon?.includes('karbar-logo')) sanitized.fev_icon = '';
          if (sanitized.title?.includes('Karbar')) sanitized.title = 'Global Bazar Store';
          
          setSettings({ ...defaultSettings, ...sanitized });
        }
      } catch (err) {
        console.warn('Using default site settings fallback:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const currencyIcon = settings?.currency_icon || '৳';

  return (
    <SiteSettingsContext.Provider value={{ settings, currencyIcon, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);

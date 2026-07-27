'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings, ThemeOptions } from '@/types/settings';
import { getSiteSettings, getThemeOptions } from '@/services/settingsService';

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  themeOptions: ThemeOptions | null;
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
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  themeOptions: null,
  currencyIcon: '৳',
  loading: false,
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(defaultSettings);
  const [themeOptions, setThemeOptions] = useState<ThemeOptions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedSettings, fetchedOptions] = await Promise.all([
          getSiteSettings(),
          getThemeOptions(),
        ]);

        if (fetchedSettings) {
          const sanitized = { ...fetchedSettings };
          if (sanitized.header_logo?.includes('karbar-logo')) sanitized.header_logo = '';
          if (sanitized.footer_logo?.includes('karbar-logo')) sanitized.footer_logo = '';
          if (sanitized.fev_icon?.includes('karbar-logo')) sanitized.fev_icon = '';
          if (sanitized.title?.includes('Karbar')) sanitized.title = 'Global Bazar Store';
          
          setSettings({ ...defaultSettings, ...sanitized });
        }

        if (fetchedOptions) {
          setThemeOptions(fetchedOptions);

          // Dynamically apply admin theme colors and typography to CSS variables
          const root = document.documentElement;
          if (fetchedOptions.base_colors?.primary_color) {
            root.style.setProperty('--primary', fetchedOptions.base_colors.primary_color);
          }
          if (fetchedOptions.base_colors?.secondary_color) {
            root.style.setProperty('--secondary', fetchedOptions.base_colors.secondary_color);
          }
          if (fetchedOptions.header?.bg_color) {
            root.style.setProperty('--header-bg', fetchedOptions.header.bg_color);
          }
          if (fetchedOptions.footer?.bg_color) {
            root.style.setProperty('--footer-bg', fetchedOptions.footer.bg_color);
          }
          if (fetchedOptions.button_settings?.bg_color) {
            root.style.setProperty('--btn-bg', fetchedOptions.button_settings.bg_color);
          }
          if (fetchedOptions.base_colors?.font_family) {
            root.style.setProperty('--font-custom', fetchedOptions.base_colors.font_family);
          }
        }
      } catch (err) {
        console.warn('Using default site settings fallback:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const currencyIcon = settings?.currency_icon || '৳';

  return (
    <SiteSettingsContext.Provider value={{ settings, themeOptions, currencyIcon, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);

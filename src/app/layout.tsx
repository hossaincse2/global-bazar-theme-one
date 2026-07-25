import type { Metadata } from 'next';
import './globals.css';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { CartProvider } from '@/context/CartContext';
import { AnnouncementBar } from '@/components/common/AnnouncementBar';
import { Header } from '@/components/common/Header';
import { CartDrawer } from '@/components/common/CartDrawer';
import { Footer } from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'Global Bazar - Next-Gen E-Commerce Theme',
  description: 'Premium e-commerce platform offering smartphones, laptops, electronics, fashion, and mega deals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <SiteSettingsProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

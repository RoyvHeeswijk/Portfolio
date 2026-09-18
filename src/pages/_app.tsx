import '@/styles/globals.css';
import '@/styles/signal.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Layout from '../components/layout/Layout';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { analyticsBeforeSend, bindOwnerAnalyticsOptOut } from '@/lib/analytics-opt-out';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-outfit',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    bindOwnerAnalyticsOptOut();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false} disableTransitionOnChange>
      <main className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} min-h-screen bg-background`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Analytics beforeSend={analyticsBeforeSend} />
        <SpeedInsights />
      </main>
    </ThemeProvider>
  );
}

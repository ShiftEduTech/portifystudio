import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import ConditionalLayout from '@/components/ConditionalLayout';
import '@/index.css';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'Portify Studio | Build Job-Winning Portfolios in Minutes',
  description: 'Portify Studio empowers developers to create world-class portfolios in minutes with 50+ professional, industry-specific templates for MERN, Java, Python, and DevOps.',
  keywords: 'developer portfolio, portfolio builder, resume website, tech portfolio, portfolio templates, MERN portfolio, Java portfolio, DevOps portfolio, developer tools',
  authors: [{ name: 'Portify Studio Team' }],
  creator: 'Portify Studio',
  publisher: 'Portify Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://portifystudio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Portify Studio | Build Job-Winning Portfolios in Minutes',
    description: 'Stop wrestling with code. Choose from 50+ premium templates designed to get you hired.',
    url: 'https://portifystudio.com',
    siteName: 'Portify Studio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Portify Studio Portfolio Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portify Studio | Build Job-Winning Portfolios in Minutes',
    description: 'The ultimate portfolio builder for modern developers.',
    images: ['/og-image.png'],
    creator: '@PortifyStudio',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-white dark:bg-[#030308] text-gray-900 dark:text-white min-h-screen transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <Toaster position="top-right" />
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

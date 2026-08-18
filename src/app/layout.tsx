import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Slekco • Multipurpose Modern E-Commerce Platform',
  description:
    'Slekco is a luxury multipurpose e-commerce experience showcasing Slekco Tech, Slekco Luxe, Slekco Living, and Slekco Glow collections.',
  keywords: [
    'Slekco',
    'E-Commerce',
    'Electronics',
    'Fashion',
    'Home Decor',
    'Skincare',
    'Multipurpose Brand',
    'Next.js E-Commerce',
  ],
  authors: [{ name: 'Slekco Team' }],
  openGraph: {
    title: 'Slekco • Multipurpose Modern E-Commerce Platform',
    description: 'Explore the full Slekco collection across Tech, Luxe, Living, and Glow.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}

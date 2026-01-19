import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wouter Wisse | full stack developer',
  description: 'Full stack developer with 15 years of experience. Building web and mobile applications.',
  keywords: ['Full Stack Developer', 'iOS Developer', 'Web Developer', 'React', 'Next.js', 'Swift'],
  authors: [{ name: 'Wouter Wisse' }],
  openGraph: {
    title: 'Wouter Wisse | full stack developer',
    description: 'Full stack developer with 15 years of experience',
    url: 'https://wouterwisse.com',
    siteName: 'Wouter Wisse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wouter Wisse | full stack developer',
    description: 'Full stack developer with 15 years of experience',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}


import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
// AuthProvider import is removed

const geistSans = GeistSans; 
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'FitGenie: AI Workout & Nutrition',
  description: 'AI-Powered Workout & Nutrition Planner by FitGenie',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans">
        {/* AuthProvider wrapper is removed */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}

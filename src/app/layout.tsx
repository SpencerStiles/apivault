import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'APIVault — API Key Manager',
  description: 'Generate, revoke, and monitor API key usage',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

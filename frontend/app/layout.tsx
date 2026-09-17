import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HelloWorld API Dashboard',
  description: 'Live dashboard for the .NET HelloWorld API deployed on Vercel',
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

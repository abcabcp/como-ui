import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'como-ui — Beautifully designed snap pickers',
  description:
    'A shadcn-style React component library featuring snap scroll pickers and more.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className="min-h-screen antialiased">{children}</body>
  </html>
);

export default RootLayout;

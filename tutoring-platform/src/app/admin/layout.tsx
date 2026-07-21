import type { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { absolute: 'Admin Panel | PK Singh' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

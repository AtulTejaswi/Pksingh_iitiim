import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { absolute: 'Account | PK Singh' },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

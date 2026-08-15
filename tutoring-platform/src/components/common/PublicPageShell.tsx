import Navbar from '@/components/student/Navbar';
import SiteFooter from '@/components/common/SiteFooter';

export default function PublicPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-ink font-sans antialiased">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <SiteFooter />
    </div>
  );
}

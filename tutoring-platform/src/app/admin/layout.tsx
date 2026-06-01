'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, Menu, X, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/courses', label: 'Courses', icon: BookOpen },
    { href: '/admin/students', label: 'Students', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-[#0b0f19] flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-[rgba(255,255,255,0.06)] bg-[#070a12]/90 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/25">
                  <span className="font-bold text-white text-sm">P</span>
                </div>
                <span className="font-bold text-base tracking-tight text-white hidden sm:block">
                  PK <span className="text-indigo-400">Admin</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 hidden md:block">{today}</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold uppercase">{user?.fullName?.[0] || 'A'}</span>
                </div>
                <span className="text-xs text-gray-300 hidden sm:block truncate max-w-[120px]">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Overlay (mobile) */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/50 lg:hidden"
              onClick={closeSidebar}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed lg:sticky top-14 lg:top-14 left-0 z-20 w-60 h-[calc(100vh-3.5rem)] border-r border-[rgba(255,255,255,0.06)] bg-[#070a12]/95 backdrop-blur-md flex flex-col justify-between p-4 transition-transform duration-200 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      isActive
                        ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.02)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <Link
                href="/"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.02)] text-xs font-semibold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                View Site
              </Link>
              <div className="px-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold uppercase">{user?.fullName?.[0] || 'A'}</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white text-xs font-semibold truncate">{user?.fullName || 'Admin'}</p>
                    <span className="text-[9px] text-gray-500 block truncate">{user?.email || ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Content panel */}
          <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
